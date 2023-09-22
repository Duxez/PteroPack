import http from '@/api/http'
import { Modpack } from './Modpack';

export default (uuid: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        http.get(`/api/client/servers/${uuid}/modpacks`)
            .then((response) =>
                resolve((response.data.data || []).map((item: any) => rawDataToModpackData(item))))
            .catch(reject);
    });
}
export const rawDataToModpackData = (data: any): Modpack => ({
    id: data.id,
    gameId: data.gameId,
    name: data.name,
    slug: data.slug,
    links: data.links,
    summary: data.summary,
    status: data.status,
    downloadCount: data.downloadCount,
    isFeatured: data.isFeatured,
    primaryCategoryId: data.primaryCategoryId,
    categories: data.categories,
    classId: data.classId,
    authors: data.authors,
    logo: data.logo,
    screenshots: data.screenshots,
    mainFileId: data.mainFileId,
    latestFiles: data.latestFiles,
    latestFileIndexes: data.latestFileIndexes,
    latestEarlyAccessFileIndexes: data.latestEarlyAccessFileIndexes,
    dateCreated: data.dateCreated,
    dateModified: data.dateModified,
    dateReleased: data.dateReleased,
    allowModDistribution: data.allowModDistribution,
    gamePopularityRank: data.gamePopularityRank,
    isAvailable: data.isAvailable,
    thumbsUpCount: data.thumbsUpCount,
});

