import { getStartupById } from "./startup.service.js";
import { memberService } from "./member.service.js";
import taskService from "./task.service.js";
import { chatService } from "./chat.service.js";

// How much of each list the overview screen gets. Full history lives
// behind the dedicated /members, /tasks, /messages endpoints — the
// overview is a snapshot for the initial paint, not a paginated feed.
const OVERVIEW_RECENT_TASKS_LIMIT = 10;
const OVERVIEW_RECENT_MESSAGES_LIMIT = 20;

// verifyWorkspaceMember already confirmed the requester belongs to this
// workspace before any of these run, so the four reads below are
// independent of each other and safe to run concurrently.
const getOverview = async (workspaceId, requesterId) => {

    const [project, members, tasks, messages] = await Promise.all([
        getStartupById(workspaceId),
        memberService.getStartupMembers(workspaceId, requesterId),
        taskService.getStartupTasks(workspaceId, requesterId),
        chatService.getMessages(workspaceId, requesterId),
    ]);

    // These service functions carry their own founder-or-accepted-member
    // check as defense-in-depth (see chat/task/member.service.js). The
    // middleware should always catch this first, but guard anyway in
    // case membership changed in the moment between the two checks.
    if (project === null) {
        return "WORKSPACE_NOT_FOUND";
    }

    if (members === "FORBIDDEN" || tasks === "FORBIDDEN" || messages === "FORBIDDEN") {
        return "FORBIDDEN";
    }

    const recentTasks = Array.isArray(tasks)
        ? tasks.slice(0, OVERVIEW_RECENT_TASKS_LIMIT)
        : [];

    // getMessages returns oldest-first (chat order); the most recent
    // messages are the last N, kept in that same chronological order.
    const recentMessages = Array.isArray(messages)
        ? messages.slice(-OVERVIEW_RECENT_MESSAGES_LIMIT)
        : [];

    return {
        workspace: {
            id: workspaceId,
            role: requesterId === project.founder_id ? "founder" : "developer",
        },
        project,
        members: Array.isArray(members) ? members : [],
        tasks: recentTasks,
        messages: recentMessages,
    };
};

const getMembers = async (workspaceId, requesterId, search = "") => {
    return memberService.getStartupMembers(workspaceId, requesterId, search);
};

const getTasks = async (workspaceId, requesterId, { search = "", page, limit } = {}) => {

    const tasks = await taskService.getStartupTasks(workspaceId, requesterId, search);

    if (tasks === "STARTUP_NOT_FOUND" || tasks === "FORBIDDEN") {
        return tasks;
    }

    return paginate(tasks, page, limit);
};

const getMessages = async (workspaceId, requesterId, { page, limit } = {}) => {

    const messages = await chatService.getMessages(workspaceId, requesterId);

    if (!Array.isArray(messages)) {
        return messages;
    }

    // Chat pages naturally read newest-first (page 1 = latest), so
    // paginate from the end of the chronological list, then restore
    // chronological order for that page.
    const reversed = [...messages].reverse();
    const page1IsNewest = paginate(reversed, page, limit);

    if (!Array.isArray(page1IsNewest)) {
        return page1IsNewest;
    }

    return [...page1IsNewest].reverse();
};

const getDetails = async (workspaceId) => {
    return getStartupById(workspaceId);
};

// Small, dependency-free pagination helper shared by getTasks/getMessages
// above. Returns the full list untouched when no page/limit was given,
// matching every other list endpoint in this codebase that defaults to
// "return everything" unless pagination is explicitly requested.
function paginate(list, page, limit) {

    const parsedLimit = Number(limit);
    const hasPagination = Number.isInteger(parsedLimit) && parsedLimit > 0;

    if (!hasPagination) {
        return list;
    }

    const parsedPage = Number(page);
    const currentPage =
        Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

    const start = (currentPage - 1) * parsedLimit;

    return list.slice(start, start + parsedLimit);
}

export const workspaceService = {
    getOverview,
    getMembers,
    getTasks,
    getMessages,
    getDetails,
};