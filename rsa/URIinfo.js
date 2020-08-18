function getQueryParams() {
    let uri = location.search;
    if (uri.indexOf("?") != -1) {
        let searchParamsString = uri.substr(1);
        let searchParams = searchParamsString.split("&");
        let times = 0;
        for (i in searchParams) {
            let param = searchParams[i].split("=");
            let res = decodeURIComponent(param[1]);
            switch (param[0]) {
                case "public_key":
                    document.getElementById('area_public_key').value = res;
                    times++;
                    break;
                case "private_key":
                    document.getElementById('area_private_key').value = res;
                    times++;
                    break;
                case "original_text":
                    document.getElementById('area_original_text').value = res;
                    times++;
                    break;
                case "cipher_text":
                    document.getElementById('area_cipher_text').value = res;
                    times++;
                    break;
            }
        }
        if (!times) {
            generateKey();
        }
    } else {
        generateKey();
    }
}

getQueryParams();