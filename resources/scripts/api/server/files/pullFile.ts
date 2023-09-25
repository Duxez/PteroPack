import http from '@/api/http';

export default (server: string, pullFileRequest: PullFileRequest): Promise<string> => {
    return new Promise((resolve, reject) => {
        http.post(`/api/client/servers/${server}/files/pull`, {
            url: encodeURI(pullFileRequest.url),
            directory: pullFileRequest.directory,
            filename: pullFileRequest.filename,
            use_header: pullFileRequest.use_header,
            foreground: pullFileRequest.foreground,
        })
            .then(({ data }) => resolve(data))
            .catch(reject);
    });
};

export interface PullFileRequest {
    url: string;
    directory: string;
    filename: string;
    use_header: boolean;
    foreground: boolean;
}
