import http from '@/api/http';

export default (server: string, file: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        http.get(`/api/client/servers/${server}/files/exists`, {
            params: { file },
        })
            .then(({ data }) => resolve(data))
            .catch(reject);
    });
};