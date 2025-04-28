import axios from "axios";


const BASE_URL = __API_MODE__ === 'serve'
    ? 'http://localhost:8011/api/v1/' // Local API server for development
    : window.location.href + "api/v1/";

export async function getFileOpen(filename) {
    const res = await axios.get(`${BASE_URL}code/open?file=${encodeURIComponent(filename)}`);
    return res.data;
}

export async function saveCode(editorContent, currentFile) {
    await axios.post(BASE_URL+"code/save", {
        code: editorContent,
        file: currentFile,
    });
}

export async function buildCode() {
    const res = await axios.post(BASE_URL + "code/build");
    return res.data;
}

export async function uploadCode() {
    const res = await axios.post(BASE_URL + "code/upload");
    return res.data;
}

export async function listFiles() {
    const res = await axios.get(BASE_URL + "code/list");
    return res.data;
}
