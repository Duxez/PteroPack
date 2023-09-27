import http from "@/api/http";

export default (server: string, modpackId: number, fileId: number): Promise<string> => {
    return new Promise((resolve, reject) => {
        http.get(`/api/client/servers/${server}/modpacks/${modpackId}/install/${fileId}`)
            .then(({ data }) => {
                console.log(data);
                resolve(data)
            })
            .catch(reject);
    });
}
