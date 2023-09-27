import http from "@/api/http";

export default (uuid: string, id: number): Promise<string> => {
    return new Promise((resolve, reject) => {

        console.log(uuid, id);

        http.get(`/api/client/servers/${uuid}/modpacks/${id}/description`)
            .then((response) => {
                resolve(response.data.data)
            })
            .catch(reject);
    });
}
