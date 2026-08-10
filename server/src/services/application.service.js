import pool from "../config/db.js";
import { notificationService } from "./notification.service.js";
import { NOTIFICATION_TYPES } from "../constants/notification.constants.js";
import fs from "fs";
import path from "path";

export const createApplication = async (applicationData, developerId, file = null) => {
    const {
        startup_id,
        message,
        relevant_experience,
        github_url,
        portfolio_url,
        skills,
        availability,
    } = applicationData;

    // Check startup exists
    const startup = await pool.query(
        `
        SELECT id, founder_id, title
        FROM startups
        WHERE id = $1
        `,
        [startup_id]
    );

    if (startup.rows.length === 0) {
        return "STARTUP_NOT_FOUND";
    }

    // Check already applied
    const existingApplication = await pool.query(
        `
        SELECT id
        FROM applications
        WHERE startup_id = $1
        AND developer_id = $2
        `,
        [startup_id, developerId]
    );

    if (existingApplication.rows.length > 0) {
        return "ALREADY_APPLIED";
    }

    let parsedSkills = [];
    if (Array.isArray(skills)) {
        parsedSkills = skills;
    } else if (typeof skills === "string") {
        try {
            parsedSkills = JSON.parse(skills);
        } catch {
            parsedSkills = skills.split(",").map((s) => s.trim()).filter(Boolean);
        }
    }

    const resumeUrl = file ? file.path : null;
    const resumeFilename = file ? file.originalname : null;

    // Create application
    const result = await pool.query(
        `
        INSERT INTO applications (
            startup_id,
            developer_id,
            message,
            relevant_experience,
            github_url,
            portfolio_url,
            resume_url,
            resume_filename,
            skills,
            availability,
            status,
            applied_at,
            updated_at
        )
        VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'pending', NOW(), NOW()
        )
        RETURNING
            id,
            startup_id,
            developer_id,
            status,
            applied_at,
            updated_at,
            message,
            relevant_experience,
            github_url,
            portfolio_url,
            resume_url,
            resume_filename,
            skills,
            availability
        `,
        [
            startup_id,
            developerId,
            message || null,
            relevant_experience || null,
            github_url || null,
            portfolio_url || null,
            resumeUrl,
            resumeFilename,
            parsedSkills,
            availability || null,
        ]
    );

    await notificationService.createNotification(
        startup.rows[0].founder_id,
        "New Application Received",
        `You have a new application for "${startup.rows[0].title}".`,
        NOTIFICATION_TYPES.APPLICATION,
        result.rows[0].id
    );

    return result.rows[0];
};

export const updateApplication = async (id, developerId, applicationData, file = null) => {
    const {
        message,
        relevant_experience,
        github_url,
        portfolio_url,
        skills,
        availability,
    } = applicationData;

    // Fetch existing application
    const existing = await pool.query(
        `
        SELECT id, developer_id, status, resume_url
        FROM applications
        WHERE id = $1
        `,
        [id]
    );

    if (existing.rows.length === 0) {
        return "APPLICATION_NOT_FOUND";
    }

    const app = existing.rows[0];

    if (app.developer_id !== developerId) {
        return "FORBIDDEN";
    }

    if (app.status !== "pending") {
        return "CANNOT_EDIT_NON_PENDING";
    }

    let parsedSkills = [];
    if (Array.isArray(skills)) {
        parsedSkills = skills;
    } else if (typeof skills === "string") {
        try {
            parsedSkills = JSON.parse(skills);
        } catch {
            parsedSkills = skills.split(",").map((s) => s.trim()).filter(Boolean);
        }
    }

    let newResumeUrl = app.resume_url;
    let newResumeFilename = undefined;

    // Handle file replacement
    if (file) {
        // Delete previous file if exists
        if (app.resume_url && fs.existsSync(app.resume_url)) {
            try {
                fs.unlinkSync(app.resume_url);
            } catch (err) {
                console.error("Failed to delete previous resume file:", err);
            }
        }
        newResumeUrl = file.path;
        newResumeFilename = file.originalname;
    }

    const result = await pool.query(
        `
        UPDATE applications
        SET
            message = COALESCE($1, message),
            relevant_experience = COALESCE($2, relevant_experience),
            github_url = COALESCE($3, github_url),
            portfolio_url = COALESCE($4, portfolio_url),
            skills = COALESCE($5, skills),
            availability = COALESCE($6, availability),
            resume_url = CASE WHEN $7::text IS NOT NULL THEN $7::text ELSE resume_url END,
            resume_filename = CASE WHEN $8::text IS NOT NULL THEN $8::text ELSE resume_filename END,
            updated_at = NOW()
        WHERE id = $9
        RETURNING
            id,
            startup_id,
            developer_id,
            status,
            applied_at,
            updated_at,
            message,
            relevant_experience,
            github_url,
            portfolio_url,
            resume_url,
            resume_filename,
            skills,
            availability
        `,
        [
            message ?? null,
            relevant_experience ?? null,
            github_url ?? null,
            portfolio_url ?? null,
            parsedSkills.length > 0 ? parsedSkills : null,
            availability ?? null,
            newResumeUrl,
            newResumeFilename ?? null,
            id,
        ]
    );

    return result.rows[0];
};

export const getApplicationById = async (id, userId) => {
    const result = await pool.query(
        `
        SELECT
            a.id,
            a.startup_id,
            a.developer_id,
            a.status,
            a.applied_at,
            a.updated_at,
            a.message,
            a.relevant_experience,
            a.github_url,
            a.portfolio_url,
            a.resume_url,
            a.resume_filename,
            a.skills,
            a.availability,

            s.title AS startup_title,
            s.tagline AS startup_tagline,
            s.founder_id,

            u.email AS developer_email,
            p.full_name AS developer_name,
            p.username AS developer_username,
            p.profile_image AS developer_avatar,
            p.bio AS developer_bio

        FROM applications a

        INNER JOIN startups s ON a.startup_id = s.id
        INNER JOIN users u ON a.developer_id = u.id
        LEFT JOIN profiles p ON p.user_id = u.id

        WHERE a.id = $1
        `,
        [id]
    );

    if (result.rows.length === 0) {
        return "APPLICATION_NOT_FOUND";
    }

    const app = result.rows[0];

    // Authorization: User must be the applicant OR the startup founder
    if (app.developer_id !== userId && app.founder_id !== userId) {
        return "FORBIDDEN";
    }

    return app;
};

export const getApplicationResumeFile = async (id, userId) => {
    const result = await pool.query(
        `
        SELECT
            a.resume_url,
            a.resume_filename,
            a.developer_id,
            s.founder_id
        FROM applications a
        INNER JOIN startups s ON a.startup_id = s.id
        WHERE a.id = $1
        `,
        [id]
    );

    if (result.rows.length === 0) {
        return "APPLICATION_NOT_FOUND";
    }

    const app = result.rows[0];

    if (app.developer_id !== userId && app.founder_id !== userId) {
        return "FORBIDDEN";
    }

    if (!app.resume_url || !fs.existsSync(app.resume_url)) {
        return "FILE_NOT_FOUND";
    }

    return {
        filePath: app.resume_url,
        fileName: app.resume_filename || path.basename(app.resume_url),
    };
};

export const getMyApplications = async (
    developerId,
    search = "",
    status = "",
    page = 1,
    limit = 10,
    sortBy = "applied_at",
    order = "DESC"
) => {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const offset = (pageNumber - 1) * limitNumber;

    const allowedSortFields = ["applied_at", "updated_at"];
    const allowedOrder = ["ASC", "DESC"];

    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "applied_at";
    const sortDirection = allowedOrder.includes(order.toUpperCase()) ? order.toUpperCase() : "DESC";

    let query = `
        SELECT
            a.id,
            a.status,
            a.applied_at,
            a.updated_at,
            a.message,
            a.relevant_experience,
            a.github_url,
            a.portfolio_url,
            a.resume_url,
            a.resume_filename,
            a.skills,
            a.availability,

            s.id AS startup_id,
            s.title,
            s.tagline

        FROM applications a

        LEFT JOIN startups s
            ON a.startup_id = s.id

        WHERE a.developer_id = $1
    `;

    const values = [developerId];

    if (search) {
        values.push(`%${search}%`);
        query += `
            AND (
                s.title ILIKE $${values.length}
                OR s.tagline ILIKE $${values.length}
            )
        `;
    }

    if (status) {
        values.push(status);
        query += `
            AND a.status = $${values.length}
        `;
    }

    query += `
        ORDER BY a.${sortField} ${sortDirection}
        LIMIT $${values.length + 1}
        OFFSET $${values.length + 2}
    `;

    values.push(limitNumber);
    values.push(offset);

    const result = await pool.query(query, values);
    return result.rows;
};

export const getStartupApplications = async (
    startupId,
    founderId,
    search = "",
    status = "",
    page = 1,
    limit = 10,
    sortBy = "applied_at",
    order = "DESC"
) => {
    // Check startup exists
    const startup = await pool.query(
        `
        SELECT founder_id
        FROM startups
        WHERE id = $1
        `,
        [startupId]
    );

    if (startup.rows.length === 0) {
        return "STARTUP_NOT_FOUND";
    }

    // Check ownership
    if (startup.rows[0].founder_id !== founderId) {
        return "FORBIDDEN";
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const offset = (pageNumber - 1) * limitNumber;

    const allowedSortFields = ["applied_at", "updated_at"];
    const allowedOrder = ["ASC", "DESC"];

    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "applied_at";
    const sortDirection = allowedOrder.includes(order.toUpperCase()) ? order.toUpperCase() : "DESC";

    let query = `
        SELECT
            a.id,
            a.startup_id,
            a.status,
            a.message,
            a.relevant_experience,
            a.github_url,
            a.portfolio_url,
            a.resume_url,
            a.resume_filename,
            a.skills,
            a.availability,
            a.applied_at,
            a.updated_at,

            u.id AS developer_id,
            u.email,

            p.full_name,
            p.username,
            p.profile_image

        FROM applications a

        LEFT JOIN users u ON a.developer_id = u.id
        LEFT JOIN profiles p ON p.user_id = u.id

        WHERE a.startup_id = $1
    `;

    const values = [startupId];

    if (search) {
        values.push(`%${search}%`);
        query += `
            AND (
                p.full_name ILIKE $${values.length}
                OR p.username ILIKE $${values.length}
                OR u.email ILIKE $${values.length}
                OR $${values.length} = ANY(a.skills)
            )
        `;
    }

    if (status) {
        values.push(status);
        query += `
            AND a.status = $${values.length}
        `;
    }

    query += `
        ORDER BY a.${sortField} ${sortDirection}
        LIMIT $${values.length + 1}
        OFFSET $${values.length + 2}
    `;

    values.push(limitNumber);
    values.push(offset);

    const result = await pool.query(query, values);
    return result.rows;
};

export const updateApplicationStatus = async (
    applicationId,
    founderId,
    status
) => {
    // Find application + startup owner
    const application = await pool.query(
        `
        SELECT
            a.id,
            a.status,
            a.developer_id,
            a.startup_id,
            s.title,
            s.founder_id,
            p.full_name
        FROM applications a
        LEFT JOIN startups s ON a.startup_id = s.id
        LEFT JOIN profiles p ON p.user_id = a.developer_id
        WHERE a.id = $1
        `,
        [applicationId]
    );

    if (application.rows.length === 0) {
        return "APPLICATION_NOT_FOUND";
    }

    // Check ownership
    if (application.rows[0].founder_id !== founderId) {
        return "FORBIDDEN";
    }

    // Already accepted/rejected
    if (application.rows[0].status !== "pending") {
        return "ALREADY_UPDATED";
    }

    // Update status and updated_at timestamp
    const result = await pool.query(
        `
        UPDATE applications
        SET status = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING
            id,
            startup_id,
            developer_id,
            status,
            applied_at,
            updated_at,
            message
        `,
        [status, applicationId]
    );

    await notificationService.createNotification(
        result.rows[0].developer_id,
        "Application Status Updated",
        status === "accepted"
            ? `Congratulations! Your application for "${application.rows[0].title}" has been accepted.`
            : `Your application for "${application.rows[0].title}" has been rejected.`,
        NOTIFICATION_TYPES.APPLICATION,
        applicationId
    );

    if (status === "accepted") {
        await notificationService.createNotification(
            founderId,
            "New Member Joined",
            `${application.rows[0].full_name || "A developer"} has joined "${application.rows[0].title}".`,
            NOTIFICATION_TYPES.PROJECT,
            applicationId
        );
    }

    return result.rows[0];
};