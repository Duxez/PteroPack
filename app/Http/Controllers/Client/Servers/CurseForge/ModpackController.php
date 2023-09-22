<?php

namespace Pterodactyl\Http\Controllers\Api\Client\Servers\CurseForge;


use GuzzleHttp\Client;
use Nette\NotImplementedException;
use Pterodactyl\Exceptions\DisplayException;
use Pterodactyl\Http\Controllers\Api\Client\ClientApiController;

class ModpackController extends ClientApiController {
    private $http_client;
    private $minecraft_game_id;
    private $modpack_class_id;

    public function __construct() {
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

        $this->minecraft_game_id = config('curseforge.minecraft_game_id');
        $this->modpack_class_id = config('curseforge.minecraft_modpack_class_id');
    }

    public function index() {
        $result = $this->http_client->get("mods/search?gameid=$this->minecraft_game_id&classid=$this->modpack_class_id&sortField=2");

        if($result->getStatusCode() !== 200) {
            throw new DisplayException('Failed to fetch modpacks from CurseForge.');
        }

        return $result->getBody()->getContents();
    }

    public function show() {
        throw new NotImplementedException();
    }

    public function install() {
        throw new NotImplementedException();
    }
}
