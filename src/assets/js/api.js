import { update } from "./mainFrame.js";

const getData = (data) => {
    localStorage.removeItem('currentSearch');

    let url = "https://itunes.apple.com/search?term=";

    const searchQuery = data.searchQuery.split(" ").join("+");

    const errorMsg = "Please type something to search";
    const errorSmall = "Please try again";
    if (!searchQuery) renderToastError(errorMsg, errorSmall);

    switch (data.type) {
        case "musicArtist":
            url += `${searchQuery}&entity=musicArtist`;
            break;
        case "album":
            url += `${searchQuery}&entity=album`;
            break;
        case "song":
            url += `${searchQuery}&entity=song`;
            break;
        case "musicVideo":
            url += `${searchQuery}&entity=musicVideo`;
            break;
    }

    const country = data.country;
    const explicit = data.explicit;
    const limit = data.limit;

    if (country) url += `&country=${country}`;
    if (explicit) url += `&country=${explicit}`;
    if (limit) url += `&limit=${limit}`;

    const settings = {
        url: url,
        contentType: "json",
        method: "GET",
    };

    $.ajax(settings)
        .done(function (result) {
            let dataJson = JSON.parse(result);
            let apiData;
            let allData = [];
            let id = 1;

            if (url.includes("song")) {
                dataJson.results.forEach((result) => {
                    apiData = {
                        cover: result.artworkUrl100,
                        song: result.trackName,
                        artist: result.artistName,
                        album: result.collectionName,
                        songPrice: result.trackPrice,
                        release: result.releaseDate,
                        duration: result.trackTimeMillis,
                        genre: result.primaryGenreName,
                        url: result.trackViewUrl,
                        preview: result.previewUrl,
                        id: result.trackId
                    };
                    allData.push(apiData);
                });
            } else if (url.includes("album")) {
                dataJson.results.forEach((result) => {
                    apiData = {
                        cover: result.artworkUrl100,
                        artist: result.artistName,
                        album: result.collectionName,
                        albumPrice: result.collectionPrice,
                        trackCount: result.trackCount,
                        release: result.releaseDate,
                        genre: result.primaryGenreName,
                        id: result.collectionId
                    };
                    allData.push(apiData);
                });
            } else if (url.includes("musicArtist")) {
                dataJson.results.forEach((result) => {
                    apiData = {
                        artist: result.artistName,
                        genre: result.primaryGenreName,
                        url: result.artistLinkUrl,
                        id: result.artistId
                    };
                    allData.push(apiData);
                });
            } else if (url.includes("musicVideo")) {
                dataJson.results.forEach((result) => {
                    apiData = {
                        cover: result.artworkUrl100,
                        song: result.trackName,
                        artist: result.artistName,
                        album: result.collectionName,
                        songPrice: result.trackPrice,
                        release: result.releaseDate,
                        duration: result.trackTimeMillis,
                        genre: result.primaryGenreName,
                        url: result.trackViewUrl,
                        preview: result.previewUrl,
                        id: id++
                    };
                    allData.push(apiData);
                });
            }

            if (allData.length === 0 && searchQuery) {
                const errorTitle =
                    "OPS! The search you typed did not match any result!";
                const errorSubtitle = "Please try again with a new search.";
                renderToastError(errorTitle, errorSubtitle);
            }
            update(allData, data.type);
            return localStorage.setItem('currentSearch', JSON.stringify(allData));
        })
        .fail(function (xhr) {
            const errorTitle = "iTunes is not available for this country.";
            const errorSubtitle = "Please choose another country.";
            renderToastError(errorTitle, errorSubtitle);
            console.log(xhr.responseText);
        });
};

function renderToastError(title, subtitle) {

  const toastContainer = $('<div class="toast__container"></div>');
  const toastP = $('<p class="toast__p"></p>').text(title);
  const toastSmall = $('<small class="toast__small"></small>').text(subtitle);
  toastContainer.append(toastP, toastSmall);
  toastContainer.fadeOut(5000);
  $('body').append(toastContainer);
}

export { getData };
