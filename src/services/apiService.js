import axios from 'axios'
import * as Consts from 'Consts';
import { config } from 'Consts';
import { toast } from 'react-toastify';
import { auth } from '../Session/firebase'

async function getTree() {

    console.log("GetTreeInvoked")
    console.log(auth);
    let call = async (header) => {

        const response = await axios.post(`${config.PATH_BASE}${Consts.PATH_TREE_CONTROLER}/${Consts.PATH_TREE_GET}`, {}, header)
        return response.data;
    }
    return invokeCallWithToast(call, "Trying to get tree", "Tree returned");
}

async function addTreeNode(parentId, name) {
    let call = async (header) => {
        const data = { ParentId: parentId, Name: name }
        const response = await axios.post(`${config.PATH_BASE}${Consts.PATH_TREE_CONTROLER}/${Consts.PATH_TREE_ADDITEM}`, data, header)
        console.log(response.data);
        return response.data;
    }
    return callAuthorizedEndpoint(call);
}

async function moveTreeNode(sourceId, targetParentId) {
    let call = async (header) => {
        const data = { SourceId: sourceId, ParentTargetId: targetParentId }
        const response = await axios.post(`${config.PATH_BASE}${Consts.PATH_TREE_CONTROLER}/${Consts.PATH_TREE_MOVEITEM}`, data, header);
        console.group(response.data);
        return response.data;
    }
    return invokeCallWithToast(call, "Moving tree element", "Tree element moved")
}

async function deleteTree(treeId) {
    let call = async (header) => {

        const data = { TreeId: Number(treeId) }
        const response = await axios.post(`${config.PATH_BASE}${Consts.PATH_TREE_CONTROLER}/${Consts.PATH_TREE_DELETE}`, data, header)
        console.log(response.data);
        return response.data;
    }
    return callAuthorizedEndpoint(call);
}

async function renameJournal(journalId, newName) {
    let call = async (header) => {
        const data = { JournalId: journalId, NewName: newName }
        const response = await axios.post(`${config.PATH_BASE}${Consts.PATH_TREE_CONTROLER}/Rename`, data, header);
        console.log(response.data);
        return response.data;
    }
    return callAuthorizedEndpoint(call)
}

async function savePage(page) {
    let call = async (header) => {
        console.log("saveMeeting");
        const response = await axios.post(`${config.PATH_BASE}${Consts.PATH_MEETINGS_CONTROLER}/${Consts.PATH_MEETING_NEW_MEETING}`, page)
        return response.data;
    }
    return invokeCallWithToast(call, "Creating new Jounral Item", "New Journal Item created")
}

async function fetchMeeting(id) {
    let call = async (header) => {
        const data = {
            Id: parseInt(id),
        }
        const response = await axios.post(`${config.PATH_BASE}${Consts.PATH_MEETINGS_CONTROLER}/${Consts.PATH_MEETING_ACTION}`, data, header)
        return response.data;
    }

    return invokeCallWithToast(call, "Trying to get Journal details", "Journal details returned");

}

async function updateJournal(meeting) {
    let call = async (header) => {
        console.log("updating meeeting");
        console.log(meeting);
        const response = await axios.post(`${config.PATH_BASE}${Consts.PATH_MEETINGS_CONTROLER}/${Consts.PATH_MEETING_UPDATE_MEETING}`, meeting, header)
        return response.data;
    }
    return invokeCallWithToast(call, "Updating Jounral Item", "Journal Item Updated")

}


async function getDate() {
    const response = await axios.post(`${config.PATH_BASE}${Consts.PATH_MEETINGS_CONTROLER}/${Consts.PATH_MEETINGS_DATE}`)
    return response.data;
}

async function deleteMeeting(journalId) {
    let call = async (header) => {
        console.log(journalId);
        const data = { Id: journalId }
        const response = await axios.post(`${config.PATH_BASE}${Consts.PATH_MEETINGS_CONTROLER}/${Consts.PATH_MEETINGS_DELETE}`, data, header)
        return response.data;
    }
    return invokeCallWithToast(call, "Deleting Journal Item", "Journal Item deleted")
}


async function invokeCallWithToast(call, pendingMessage, successMessage) {
    return toast.promise(
        invokeCall(call),
        {
            pending: pendingMessage ? pendingMessage : "Missing pending message",
            success: successMessage ? successMessage : "Missing sucesss message",
            error: {
                render({ data }) {
                    console.log(data);
                    return <p>{data.message} [{data.response.data.message}]</p>
                }
            }
        }
    )
}


async function fetchPageList(treeId) {

    let call = async (header) => {
        const data = { Id: Number(treeId), DrillDown: true }
        const response = await axios.post(`${config.PATH_BASE}${Consts.PATH_MEETINGS_CONTROLER}/${Consts.PATH_MEETINGS_ACTION}`, data, header)
        console.log(response.data);
        return response.data;
    }
    return invokeCallWithToast(call, "Trying to meeting list", "Meeting list returned");
}

async function callAuthorizedEndpoint(call) {
    console.log("auth", auth);
    console.log("current user", auth.currentUser)
    if (auth && auth.currentUser && auth.currentUser.accessToken) {
        const header = {
            headers: { Authorization: `Bearer ${auth.currentUser.accessToken}` }
        };
        try {
            const result = await call(header);
            return result;
        }
        catch (error) {
            console.log(error)
        }
    }

    else {
        console.log("User not authenticated")
    }
}

async function invokeCall(call) {
    let token = localStorage.getItem('token')
    //console.log("token from localstorage", token)
    const header = { headers: { Authorization: `Bearer ${token}` } }
    try {
        const response = call(header);
        return response;
    } catch (error) {
        console.log("Call endpoint");
        console.log(error);
    }
}



export {
    getTree,
    addTreeNode,
    deleteTree,
    moveTreeNode,
    renameJournal,
    savePage,
    fetchMeeting,
    deleteMeeting,
    updateJournal,
    getDate,
    fetchPageList
}