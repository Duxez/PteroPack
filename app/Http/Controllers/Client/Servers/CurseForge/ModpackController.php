<?php

namespace Pterodactyl\Http\Controllers\Api\Client\Servers\CurseForge;


use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Nette\NotImplementedException;
use Pterodactyl\Exceptions\DisplayException;
use Pterodactyl\Jobs\ModInstall;
use Pterodactyl\Http\Controllers\Api\Client\ClientApiController;
use Pterodactyl\Repositories\Wings\DaemonFileRepository;

class ModpackController extends ClientApiController {
    private $http_client;
    private $minecraft_game_id;
    private $modpack_class_id;
    private $api_key;
    private DaemonFileRepository $fileRepository;


    public function __construct(DaemonFileRepository $fileRepository) {
        parent::__construct();

        if(!config('curseforge.api_key')) {
            throw new DisplayException('CurseForge API key is not set.');
        }

        $this->http_client = new Client([
            'base_uri' => 'https://api.curseforge.com/v1/',
            'headers' => [
                'x-api-key' => config('curseforge.api_key'),
            ]
        ]);

        $this->api_key = config('curseforge.api_key');
        $this->minecraft_game_id = config('curseforge.minecraft_game_id');
        $this->modpack_class_id = config('curseforge.minecraft_modpack_class_id');

        $this->fileRepository = $fileRepository;
    }

    public function index(Request $request) {
        $index = 0;
        if($request->has('pageindex')) {
            $index = $request->get('pageindex');
        }

        $queryString = '';
        if($request->has('modloader') && $request->get('modloader') !== '0') {
            $queryString .= '&modloadertype=' . $request->get('modloader');
        }

        $result = $this->http_client->get("mods/search?gameid=$this->minecraft_game_id&classid=$this->modpack_class_id&sortField=2&sortorder=desc&index=$index$queryString");

        if($result->getStatusCode() !== 200) {
            throw new DisplayException('Failed to fetch modpacks from CurseForge.');
        }

        return $result->getBody()->getContents();
    }

    public function getInstalledGame(Request $request, $server) {
        return $server->egg->nest->name;
    }

    public function description(Request $request, $server, $modpack) {

        $result = $this->http_client->get("mods/$modpack/description");

        if($result->getStatusCode() !== 200) {
            throw new DisplayException('Failed to fetch modpack description from CurseForge.');
        }

        return $result->getBody()->getContents();
    }

    public function show() {
        throw new NotImplementedException();
    }

    public function install($server, $modId, $fileId) {
        $this->fileRepository->setServer($server)->deleteFiles('/', ['mods']);
        $this->fileRepository->setServer($server)->deleteFiles('/', ['uninstallable.txt']);

        $modpackFile = json_decode($this->getFileById($modId, $fileId));

        $data = $modpackFile->data;
        $modpackFileUrl = $this->traceUrl($data->downloadUrl);

        $this->fileRepository->setServer($server)->pull(
            $modpackFileUrl,
            '/',
            ['filename' => 'modpack.zip', 'foreground' => true]
        );

        $this->fileRepository->setServer($server)->decompressFile('', 'modpack.zip');
        $modpackManifest = json_decode($this->fileRepository->setServer($server)->getContent('manifest.json'));

        $job = ModInstall::dispatch($modpackManifest, $server, $this->api_key);

        return response()->json([
            'success' => true,
        ]);
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

    private function getModById(int $modId): string {
        $result = $this->http_client->get("mods/$modId");

        return $result->getBody()->getContents();
    }

    private function getFileById(int $modId, int $fileId): string {
        $result = $this->http_client->get("mods/$modId/files/$fileId");

        return $result->getBody()->getContents();
    }
}
