import axios from "axios";


export async function handleFileOpen(filename) {
    const res = await axios.get(`/api/v1/code/open?file=${encodeURIComponent(filename)}`);
    return res.data.content;
}

export async function saveCode(code) {
    await axios.post("/api/v1/code/save", { code });
}

export async function buildCode() {
    const res = await axios.post("/api/v1/code/build");
    return res.data;
}

export async function uploadCode() {
    const res = await axios.post("/api/v1/code/upload");
    return res.data;
}
