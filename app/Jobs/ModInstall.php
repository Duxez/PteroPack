<?php

namespace Pterodactyl\Jobs;
use GuzzleHttp\Client;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Pterodactyl\Repositories\Wings\DaemonFileRepository;

class ModInstall implements ShouldQueue {
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private $http_client;
    private $api_key;
    private $modpackManifest;
    private $server;

    public function __construct(object $modpackManifest, $server, $api_key){
        $this->api_key = $api_key;
        $this->modpackManifest = $modpackManifest;
        $this->server = $server;
    }

    public function handle(DaemonFileRepository $fileRepository) {
        $this->http_client = new Client([
            'base_uri' => 'https://api.curseforge.com/v1/',
            'headers' => [
                'x-api-key' => $this->api_key,
            ]
        ]);

        $uninstallable = [];

        foreach($this->modpackManifest->files as $file) {
            $modFile = json_decode($this->getFileById($file->projectID, $file->fileID));
            $modFileUrl = $this->traceUrl($modFile->data->downloadUrl);

            if($modFileUrl == null) {
                $uninstallable[] = $modFile->data->fileName;
                continue;
            }

            $fileRepository->setServer($this->server)->pull(
                $modFileUrl,
                'mods',
                ['filename' => $modFile->data->fileName, 'foreground' => true]
            );
        }

        $fileRepository->putContent('uninstallable.txt', print_r($uninstallable));
        $fileRepository->deleteFiles('/', ['modpack.zip', 'manifest.json', $this->modpackManifest->overrides]);
    }

    private function getFileById(int $modId, int $fileId): string {
        $result = $this->http_client->get("mods/$modId/files/$fileId");

        return $result->getBody()->getContents();
    }

    private function traceUrl(string $url): string {
        $httpCode = '';
        while (!str_contains($httpCode, '200 OK')) {
            $headers = get_headers($url, 5);
            $httpCode = $headers[0];
            if (array_key_exists('Location', $headers) && !empty($headers['Location'])) {
                $url = $headers['Location'];
            } else {
                break;
            }
        }

        return $url;
    }
}
