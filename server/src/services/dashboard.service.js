import pool from "../config/db.js";

// When startupId is provided, every query below is scoped to that single
// startup via "$2::uuid IS NULL OR s.id = $2" — startupId stays null for the
// "all projects" view so the same queries serve both cases without
// duplicating SQL.
export const getDashboardAnalytics = async (founderId, startupId = null) => {

    // Total Startups
    const totalStartupsResult = await pool.query(
        `
        SELECT COUNT(*) AS total_startups
        FROM startups
        WHERE founder_id = $1
        AND ($2::uuid IS NULL OR id = $2)
        `,
        [founderId, startupId]
    );

    // Total Applications
    const totalApplicationsResult = await pool.query(
        `
        SELECT COUNT(*) AS total_applications
        FROM applications a
        INNER JOIN startups s
            ON a.startup_id = s.id
        WHERE s.founder_id = $1
        AND ($2::uuid IS NULL OR s.id = $2)
        `,
        [founderId, startupId]
    );

    // Pending Applications
    const pendingApplicationsResult = await pool.query(
        `
        SELECT COUNT(*) AS pending_applications
        FROM applications a
        INNER JOIN startups s
            ON a.startup_id = s.id
        WHERE s.founder_id = $1
        AND ($2::uuid IS NULL OR s.id = $2)
        AND a.status = 'pending'
        `,
        [founderId, startupId]
    );

    // Accepted Applications
    const acceptedApplicationsResult = await pool.query(
        `
        SELECT COUNT(*) AS accepted_applications
        FROM applications a
        INNER JOIN startups s
            ON a.startup_id = s.id
        WHERE s.founder_id = $1
        AND ($2::uuid IS NULL OR s.id = $2)
        AND a.status = 'accepted'
        `,
        [founderId, startupId]
    );

    // Removed Applications
    const rejectedApplicationsResult = await pool.query(
        `
        SELECT COUNT(*) AS rejected_applications
        FROM applications a
        INNER JOIN startups s
            ON a.startup_id = s.id
        WHERE s.founder_id = $1
        AND ($2::uuid IS NULL OR s.id = $2)
        AND a.status = 'removed'
        `,
        [founderId, startupId]
    );

    // Total Developers — sourced from accepted applications, the same
    // source of truth used everywhere else in the app (chat, tasks,
    // members). The project_members/projects tables are never actually
    // populated anywhere in this codebase, so querying them here always
    // silently returned 0.
    const totalDevelopersResult = await pool.query(
        `
        SELECT COUNT(DISTINCT a.developer_id) AS total_developers
        FROM applications a
        INNER JOIN startups s
            ON a.startup_id = s.id
        WHERE s.founder_id = $1
        AND ($2::uuid IS NULL OR s.id = $2)
        AND a.status = 'accepted'
        `,
        [founderId, startupId]
    );

    // Total Tasks
    const totalTasksResult = await pool.query(
        `
        SELECT COUNT(*) AS total_tasks
        FROM tasks t
        INNER JOIN startups s
            ON t.startup_id = s.id
        WHERE s.founder_id = $1
        AND ($2::uuid IS NULL OR s.id = $2)
        `,
        [founderId, startupId]
    );

    // Completed Tasks
    const completedTasksResult = await pool.query(
        `
        SELECT COUNT(*) AS completed_tasks
        FROM tasks t
        INNER JOIN startups s
            ON t.startup_id = s.id
        WHERE s.founder_id = $1
        AND ($2::uuid IS NULL OR s.id = $2)
        AND t.status = 'done'
        `,
        [founderId, startupId]
    );

    // Pending Tasks
    const pendingTasksResult = await pool.query(
        `
        SELECT COUNT(*) AS pending_tasks
        FROM tasks t
        INNER JOIN startups s
            ON t.startup_id = s.id
        WHERE s.founder_id = $1
        AND ($2::uuid IS NULL OR s.id = $2)
        AND t.status = 'todo'
        `,
        [founderId, startupId]
    );

    // In Progress Tasks — completes the real 3-status breakdown
    // (todo / in_progress / done). The app has no "review" status, so
    // the dashboard should only ever show these three, not a fabricated
    // fourth category.
    const inProgressTasksResult = await pool.query(
        `
        SELECT COUNT(*) AS in_progress_tasks
        FROM tasks t
        INNER JOIN startups s
            ON t.startup_id = s.id
        WHERE s.founder_id = $1
        AND ($2::uuid IS NULL OR s.id = $2)
        AND t.status = 'in_progress'
        `,
        [founderId, startupId]
    );

    // Recent Applications — across this founder's startups, or scoped to
    // one selected startup.
    const recentApplicationsResult = await pool.query(
        `
        SELECT
            a.id,
            a.status,
            a.applied_at,
            p.full_name AS applicant_name,
            s.id AS startup_id,
            s.title AS startup_title
        FROM applications a
        INNER JOIN startups s
            ON a.startup_id = s.id
        INNER JOIN profiles p
            ON a.developer_id = p.user_id
        WHERE s.founder_id = $1
        AND ($2::uuid IS NULL OR s.id = $2)
        ORDER BY a.applied_at DESC
        LIMIT 5
        `,
        [founderId, startupId]
    );

    // Upcoming Deadlines — tasks across this founder's startups (or one
    // selected startup) with a deadline in the future that aren't done yet.
    const upcomingDeadlinesResult = await pool.query(
        `
        SELECT
            t.id,
            t.title,
            t.priority,
            t.deadline,
            t.status,
            s.title AS startup_title,
            p.full_name AS assignee_name
        FROM tasks t
        INNER JOIN startups s
            ON t.startup_id = s.id
        LEFT JOIN profiles p
            ON t.assigned_to = p.user_id
        WHERE s.founder_id = $1
        AND ($2::uuid IS NULL OR s.id = $2)
        AND t.status != 'done'
        AND t.deadline IS NOT NULL
        AND t.deadline >= CURRENT_DATE
        ORDER BY t.deadline ASC
        LIMIT 5
        `,
        [founderId, startupId]
    );

    // My Startups overview — each startup with its own application and
    // team counts, for the dashboard's startup list panel.
    const startupsOverviewResult = await pool.query(
        `
        SELECT
            s.id,
            s.title,
            s.tagline,
            s.status,
            s.created_at,
            COUNT(a.id) FILTER (WHERE a.id IS NOT NULL) AS applications_count,
            COUNT(a.id) FILTER (WHERE a.status = 'accepted') AS team_count
        FROM startups s
        LEFT JOIN applications a
            ON a.startup_id = s.id
        WHERE s.founder_id = $1
        AND ($2::uuid IS NULL OR s.id = $2)
        GROUP BY s.id
        ORDER BY s.created_at DESC
        LIMIT 5
        `,
        [founderId, startupId]
    );

    // Recent Activity — a merged, real event feed built from application
    // and task events actually stored in the database. No placeholder
    // or fabricated events.
    const recentActivityResult = await pool.query(
        `
        (
            SELECT
                'application' AS type,
                a.applied_at AS timestamp,
                p.full_name AS actor_name,
                s.title AS startup_title,
                a.status::text AS detail
            FROM applications a
            INNER JOIN startups s ON a.startup_id = s.id
            INNER JOIN profiles p ON a.developer_id = p.user_id
            WHERE s.founder_id = $1
            AND ($2::uuid IS NULL OR s.id = $2)
            ORDER BY a.applied_at DESC
            LIMIT 8
        )
        UNION ALL
        (
            SELECT
                'task_completed' AS type,
                t.updated_at AS timestamp,
                p.full_name AS actor_name,
                s.title AS startup_title,
                t.title AS detail
            FROM tasks t
            INNER JOIN startups s ON t.startup_id = s.id
            LEFT JOIN profiles p ON t.assigned_to = p.user_id
            WHERE s.founder_id = $1
            AND ($2::uuid IS NULL OR s.id = $2)
            AND t.status = 'done'
            ORDER BY t.updated_at DESC
            LIMIT 8
        )
        ORDER BY timestamp DESC
        LIMIT 8
        `,
        [founderId, startupId]
    );
    const monthlyStartupGrowthResult = await pool.query(
        `
        SELECT
            TO_CHAR(month_series, 'Mon YYYY') AS month,
            COUNT(s.id) AS count
        FROM generate_series(
            date_trunc('month', CURRENT_DATE) - INTERVAL '5 months',
            date_trunc('month', CURRENT_DATE),
            INTERVAL '1 month'
        ) AS month_series
        LEFT JOIN startups s
            ON date_trunc('month', s.created_at) = month_series
            AND s.founder_id = $1
            AND ($2::uuid IS NULL OR s.id = $2)
        GROUP BY month_series
        ORDER BY month_series
        `,
        [founderId, startupId]
    );

    // ---------- Formatting ----------

    const totalStartups = Number(
        totalStartupsResult.rows[0].total_startups
    );

    const totalApplications = Number(
        totalApplicationsResult.rows[0].total_applications
    );

    const pendingApplications = Number(
        pendingApplicationsResult.rows[0].pending_applications
    );

    const acceptedApplications = Number(
        acceptedApplicationsResult.rows[0].accepted_applications
    );

    const rejectedApplications = Number(
        rejectedApplicationsResult.rows[0].rejected_applications
    );

    const totalDevelopers = Number(
        totalDevelopersResult.rows[0].total_developers
    );

    const totalTasks = Number(
        totalTasksResult.rows[0].total_tasks
    );

    const completedTasks = Number(
        completedTasksResult.rows[0].completed_tasks
    );

    const pendingTasks = Number(
        pendingTasksResult.rows[0].pending_tasks
    );

    const inProgressTasks = Number(
        inProgressTasksResult.rows[0].in_progress_tasks
    );

    const completionRate =
        totalTasks === 0
            ? 0
            : Math.round((completedTasks / totalTasks) * 100);

    const monthlyStartupGrowth = monthlyStartupGrowthResult.rows.map((row) => ({
        month: row.month,
        count: Number(row.count),
    }));

    const recentApplications = recentApplicationsResult.rows.map((row) => ({
        id: row.id,
        applicantName: row.applicant_name,
        startupId: row.startup_id,
        startupTitle: row.startup_title,
        status: row.status,
        appliedAt: row.applied_at,
    }));

    const upcomingDeadlines = upcomingDeadlinesResult.rows.map((row) => ({
        id: row.id,
        title: row.title,
        priority: row.priority,
        deadline: row.deadline,
        status: row.status,
        startupTitle: row.startup_title,
        assigneeName: row.assignee_name,
    }));

    const startupsOverview = startupsOverviewResult.rows.map((row) => ({
        id: row.id,
        title: row.title,
        tagline: row.tagline,
        status: row.status,
        createdAt: row.created_at,
        applicationsCount: Number(row.applications_count),
        teamCount: Number(row.team_count),
    }));

    const recentActivity = recentActivityResult.rows.map((row) => ({
        type: row.type,
        timestamp: row.timestamp,
        actorName: row.actor_name,
        startupTitle: row.startup_title,
        detail: row.detail,
    }));

    return {
        totalStartups,
        totalApplications,
        pendingApplications,
        acceptedApplications,
        rejectedApplications,
        totalDevelopers,
        totalTasks,
        completedTasks,
        pendingTasks,
        inProgressTasks,
        completionRate,
        monthlyStartupGrowth,
        recentApplications,
        upcomingDeadlines,
        startupsOverview,
        recentActivity,
    };
};