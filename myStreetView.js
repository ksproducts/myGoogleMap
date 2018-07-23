
/**
 *
 *  $ JavaScript Library for GoogleMapAPI StreetView $
 *
 */


//===========================================
// ストリートビュークラス
//===========================================
//{
    var myStreetView = {

        id: "",
        radius: 50, //ストリートビューを検索する半径
        panorama: null,

        panoramaOptions: {
            position: "",
            pov: {
                heading: 0,
                pitch: 0,
                zoom: 1
            }
        },

        makeStreetView: function(id, stLat, stLon)
        {
            this.id = id;

            document.getElementById(this.id).innerHTML = "";

            targetLatLng = new google.maps.LatLng(stLat, stLon);
            this.panoramaOptions.position = targetLatLng;

            stPanorama = new google.maps.StreetViewPanorama(document.getElementById(this.id), this.panoramaOptions);

            this.panorama = stPanorama;

            stClient = new google.maps.StreetViewService();
            stClient.getPanoramaByLocation(targetLatLng, myStreetView.radius, function(result, status) { 
                if (status == google.maps.StreetViewStatus.OK) {

                    var nearestPano   = result.location.pano;
                    var nearestLatLng = result.location.latLng;
                    stPanorama.setPosition(nearestLatLng);

                    var yaw = myStreetView.calcYaw(nearestLatLng, targetLatLng);
                    if (yaw >= 0) {

                        var pov = {
                            heading: yaw,
                            pitch: 0,
                            zoom: 0
                        };

                        stPanorama.setPov(pov);
                    }

                } else if (status == google.maps.StreetViewStatus.ZERO_RESULTS) {

                    //alert("半径" + myStreetView.radius + "m以内のストリートビューが見つかりませんでした。");
                    myStreetView.Error(600);

                } else if (status == google.maps.StreetViewStatus.UNKNOWN_ERROR) {

                    //alert("google.maps.StreetViewServiceの不明なエラーです。");
                    this.Error(600);

                } else {

                    this.Error(600);

                }
            });
        },

        Error: function(errorCode)
        {
            if (errorCode == 600) {
                document.getElementById(myStreetView.id).innerHTML = "<p>ストリートビュー未対応エリアです。</p>";
                return;
            } else if (errorCode == 603) {
                document.getElementById(myStreetView.id).innerHTML = "<p>ブラウザがFlash未対応です。</p><p>以下のリンクよりFlashPlayerをインストールしてください。<br><a href=\"http://get.adobe.com/jp/flashplayer/\" target=\"_blank\"><img src=\"http://www.sankikensetsu.co.jp/images/get_adobe_flash_player.png\"></a></p>";
                return;
            }
        },

        // 現在地から目的地の方向（角度）を計算する
        calcYaw: function(fromLatLng, toLatLng)
        {
            if (fromLatLng.equals(toLatLng)) {
                return -1;
            }

            var lat_f = fromLatLng.lat();
            var lng_f = fromLatLng.lng();
            var lat_t = toLatLng.lat();
            var lng_t = toLatLng.lng();

            var yaw = 90 - Math.atan2(lat_t - lat_f, lng_t - lng_f) * 180 / Math.PI;

            if (yaw < 0) {
                yaw += 360;
            }

            return yaw;
        },

    };
//}
