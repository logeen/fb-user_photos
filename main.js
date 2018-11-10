/**
 * This script obtains all user's photos list from Facebook and sort them by achieved reactions (likes ets.).
 * @see photos
 * @file
 */

/**
 * Item
 * @class Item
 * @property {String} link URL address
 * @property {String} created_time Created date and time (ISO format)
 * @property {Number} reactions Number of reactions (likes etc.)
 */
/**
 * Photo
 * @class Photo
 * @property {Item} album Photo album
 * @extends Item
 */
/**
 * Obtained photos list will be available here
 * @type {Photo[]}
 */
let photos = [];

/**
 * Facebook API access token
 * @constant {String}
 * @see https://developers.facebook.com/tools/explorer/
 */
const ACCESS_TOKEN = 'INSERT_ACCESS_TOKEN_HERE';
/**
 * Facebook blocks too frequent API calls
 * @constant {Number}
 */
const TIMEOUT = 20000;
/**
 * Facebook API URL address with API version
 * @constant {String}
 */
const API_URL = 'https://graph.facebook.com/v3.1/';

const parsePhotos = (album, data, callback) => {
    if (data && data.data) {
        console.log('PHOTOS:', data.data.length);
        data.data.forEach(photo => photos.push({
            link: photo.link,
            created_time: photo.created_time,
            reactions: photo.reactions.summary.total_count,
            album: {
                link: album.link,
                created_time: album.created_time,
                reactions: album.reactions.summary.total_count
            }
        }));
    }
    if (data && data.paging && data.paging.next) {
        console.log('NEXT PHOTOS:', data.paging.next);
        load(data.paging.next, data => parsePhotos(album, data, callback));
        return;
    }
    console.log('END PHOTOS');
    callback();
};

const loadPhotos = (albums, callback) => {
    if (albums && albums.length) {
        const album = albums.pop();
        load(`${API_URL}${album.id}/photos?fields=link,created_time,reactions.summary(true)&access_token=${ACCESS_TOKEN}`, data => {
            parsePhotos(album, data, () => loadPhotos(albums, callback));
        })
        return;
    }
    callback();
};

const parseAlbums = data => {
    if (data && data.data) {
        console.log('ALBUMS:', data.data.length);
        loadPhotos(data.data, () => {
            if (data.paging && data.paging.next) {
                console.log('NEXT ALBUMS:', data.paging.next);
                load(data.paging.next, parseAlbums);
            } else {
                console.log('END ALBUMS');
                photos.sort((a, b) =>
                    (b.reactions && b.reactions + b.album.reactions) - (a.reactions && a.reactions + a.album.reactions) ||
                    b.reactions - a.reactions ||
                    b.album.reactions - a.album.reactions ||
                    new Date(a.created_time) - new Date(b.created_time)
                );
                console.log(photos);
            }
        });
    }
};

const load = (url, parse) => setTimeout(() => fetch(url).then(response => response.json().then(parse)), TIMEOUT);

load(`${API_URL}me/albums?fields=id,link,created_time,reactions.summary(true)&access_token=${ACCESS_TOKEN}`, parseAlbums);
