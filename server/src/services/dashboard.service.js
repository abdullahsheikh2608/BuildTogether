import pool from "../config/db.js";

export const getDashboardAnalytics = async (founderId) => {

    // Total Startups
    const totalStartupsResult = await pool.query(
        `
        SELECT COUNT(*) AS total_startups
        FROM startups
        WHERE founder_id = $1
        `,
        [founderId]
    );

    // Total Applications
    const totalApplicationsResult = await pool.query(
        `
        SELECT COUNT(*) AS total_applications
        FROM applications a
        INNER JOIN startups s
            ON a.startup_id = s.id
        WHERE s.founder_id = $1
        `,
        [founderId]
    );

    // Pending Applications
    const pendingApplicationsResult = await pool.query(
        `
        SELECT COUNT(*) AS pending_applications
        FROM applications a
        INNER JOIN startups s
            ON a.startup_id = s.id
        WHERE s.founder_id = $1
        AND a.status = 'pending'
        `,
        [founderId]
    );

    // Accepted Applications
    const acceptedApplicationsResult = await pool.query(
        `
        SELECT COUNT(*) AS accepted_applications
        FROM applications a
        INNER JOIN startups s
            ON a.startup_id = s.id
        WHERE s.founder_id = $1
        AND a.status = 'accepted'
        `,
        [founderId]
    );

    // Removed Applications
    const rejectedApplicationsResult = await pool.query(
        `
        SELECT COUNT(*) AS rejected_applications
        FROM applications a
        INNER JOIN startups s
            ON a.startup_id = s.id
        WHERE s.founder_id = $1
        AND a.status = 'removed'
        `,
        [founderId]
    );

    // Total Developers
    const totalDevelopersResult = await pool.query(
        `
        SELECT COUNT(DISTINCT pm.user_id) AS total_developers
        FROM project_members pm
        INNER JOIN projects p
            ON pm.project_id = p.id
        WHERE p.founder_id = $1
        `,
        [founderId]
    );

    // Total Tasks
    const totalTasksResult = await pool.query(
        `
        SELECT COUNT(*) AS total_tasks
        FROM tasks t
        INNER JOIN startups s
            ON t.startup_id = s.id
        WHERE s.founder_id = $1
        `,
        [founderId]
    );

    // Completed Tasks
    const completedTasksResult = await pool.query(
        `
        SELECT COUNT(*) AS completed_tasks
        FROM tasks t
        INNER JOIN startups s
            ON t.startup_id = s.id
        WHERE s.founder_id = $1
        AND t.status = 'done'
        `,
        [founderId]
    );

    // Pending Tasks
    const pendingTasksResult = await pool.query(
        `
        SELECT COUNT(*) AS pending_tasks
        FROM tasks t
        INNER JOIN startups s
            ON t.startup_id = s.id
        WHERE s.founder_id = $1
        AND t.status = 'todo'
        `,
        [founderId]
    );

    // Monthly Startup Growth (last 6 months, including months with zero startups)
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
        GROUP BY month_series
        ORDER BY month_series
        `,
        [founderId]
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

    const completionRate =
        totalTasks === 0
            ? 0
            : Math.round((completedTasks / totalTasks) * 100);

    const monthlyStartupGrowth = monthlyStartupGrowthResult.rows.map((row) => ({
        month: row.month,
        count: Number(row.count),
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
        completionRate,
        monthlyStartupGrowth,
    };
};