
/**
 *
 *  $ JavaScript Library for GoogleMapAPI v3 $
 *  $ for 'GoogleMapAPI version 3.26'        $
 *
 */


//===========================================
// GoogleMapクラス
//===========================================
//{
    var myGoogleMap = {

        // GoogleMapを表示するエレメントのID
        id: null,

        // GoogleMapインスタンス用
        map: null,

        // アイコンフラグ
        icon: null,
        icon_shadow: null,

        // マーカー配列用
        Markers: null,

        // タイマーID
        timerID: null,

        // イベントリスナー
        resize_listener: null,        // リサイズ
        click_listener: null,         // クリック
        dblClick_listener: null,      // ダブルクリック
        centerChanged_listener: null, // 中心点変更
        idle_listener: null,          // アイドル状態
        zoomChanged_listener: null,   // ズームレベル変更

        // 初期座標設定
        default_location: { //世界測地系
            lat : 35.658582050535614,
            lng : 139.74543124437332,
        },

        // GoogleMap Property
        //{
            myOptions: {
                center: null,
                disableDoubleClickZoom: true,
                draggable: true,
                mapTypeControl: true,
                //mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DEFAULT}, // DEFAULT,HORIZONTAL_BAR,DROPDOWN_MENU
                mapTypeId: google.maps.MapTypeId.ROADMAP, // ROADMAP,SATELLITE,HYBRID,TERRAIN
                streetViewControl: false,
                navigationControl: true,
                //navigationControlOptions: {style: google.maps.NavigationControlStyle.DEFAULT}, // DEFAULT,SMALL,ANDROID,ZOOM_PAN
                scaleControl: true,
                //scaleControlOptions: {style: google.maps.ScaleControlStyle.STANDARD},
                scrollwheel: false,
                zoomControl: true,
                zoom: 11,
                maxzoom: 21,          //カスタム追加（拡大の最大値：0～21（実際には20まで））
                metric: false,        //カスタム追加（世界測地系に変換するか）
                addMarkers: false,    //カスタム追加（クリックしてマーカーを追加するかどうか）
                adjustMarkers: false, //カスタム追加（近接するマーカーを位置調整するかどうか）
                adjustBounds: false   //カスタム追加（全てのマーカーが表示されるように自動調節するかどうか）
            },
        //}

        // Marker Property
        //{
            markerOptions: {
                title: null,
                icon: null,
                shadow: null,
                draggable: false,
                crossOnDrag: true,          //ドラッグ中の十字マーク表示
                //animation: google.maps.Animation.DROP, //(BOUNCE|DROP)
                enableDelete: false,        //カスタム追加（マーカークリックで削除するか）
                enableInfoWindow: false     //カスタム追加（情報ウィンドウを表示するか）
            },
        //}

        // Route Request Property
        //{
            requestOptions: {
                origin: null,      // 出発地点
                destination: null, // 到着地点
                travelMode: google.maps.DirectionsTravelMode.DRIVING // DRIVING=自動車,BICYCLING=自転車,TRANSIT=電車,WALKING=徒歩
            },
        //}

        // GoogleMap 表示関数
        //{
            make: function(element_id)
            {
                // Internet Explorer 5.5 is Not Available
                if(navigator.userAgent.indexOf("MSIE 5.5") != -1) {
                    return null;
                }

                this.id = element_id;

                this.myOptions.center = new google.maps.LatLng(this.default_location.lat, this.default_location.lng);

                this.myOptions.draggableCursor = null;
                this.myOptions.draggingCursor  = null;

                //GoogleMapインスタンスを生成(v3)
                this.map = new google.maps.Map(document.getElementById(this.id), this.myOptions);

                // マーカー配列の初期化
                this.Markers = new Array();

                //this.icon        = this.makeIcon();
                //this.icon_shadow = this.makeIconShadow();

                this.addEvent();
            },
        //}

        // イベントの追加
        //{
            addEvent: function()
            {
                // 読み込み完了時に一度だけ実行
                google.maps.event.addListenerOnce(map, "idle", function()
                {
                    // code
                });

                // divリサイズ時mapイベント
                // リサイズ時にも中心点をキープする
                google.maps.event.removeListener(this.resize_listener);
                this.resize_listener = google.maps.event.addListener(this.map, "resize", function(LatLng)
                {
                    if(LatLng != null) myGoogleMap.map.setCenter(LatLng, myGoogleMap.myOptions.zoom);
                });

                // divリサイズ時mapイベントのトリガー
                document.getElementById("map").onresize = function()
                {
                    var LatLng = myGoogleMap.map.getCenter();
                    google.maps.event.trigger(myGoogleMap.map, "resize", LatLng);
                }

                google.maps.event.removeListener(this.click_listener);
                this.click_listener = google.maps.event.addListener(this.map, "click", function(e)
                {
                    if(myGoogleMap.myOptions.addMarkers) {

                        if(e) {
                            myGoogleMap.createMarker(e.latLng.lat(), e.latLng.lng(), false);
                        }
                    }
                });

                google.maps.event.removeListener(this.dblClick_listener);
                this.dblClick_listener = google.maps.event.addListener(this.map, "dblclick", function(e)
                {
                    // code
                });

                google.maps.event.removeListener(this.centerChanged_listener);
                this.centerChanged_listener = google.maps.event.addListener(this.map, "center_changed", function()
                {
                    // code
                });

                google.maps.event.removeListener(this.idle_listener);
                this.idle_listener = google.maps.event.addListener(this.map, "idle", function()
                {

                    // 表示領域を生成します。
                    var bounds = myGoogleMap.map.getBounds();

                    //マーカーが境界内に含まれるかどうかで表示・非表示を切り替え
                    for(mark in myGoogleMap.Markers) {

                        if(bounds.contains(myGoogleMap.Markers[mark].position)) {
                            if(myGoogleMap.Markers[mark].getMap() == null) {
                                myGoogleMap.Markers[mark].setMap(myGoogleMap.map);
                            }
                        } else {
                            myGoogleMap.Markers[mark].setMap(null);
                        }

                    }

                });

                google.maps.event.removeListener(this.zoomChanged_listener);
                this.zoomChanged_listener = google.maps.event.addListener(this.map, "zoom_changed", function()
                {
                    var z = myGoogleMap.map.getZoom();

                    if(z > myGoogleMap.myOptions.maxzoom) {
                        myGoogleMap.map.setZoom(myGoogleMap.myOptions.maxzoom);
                        alert("これ以上拡大できません。");
                    }
                });

            },
        //}

        // ズームメソッド
        //{
            myZoomIn: function()
            {
                this.map.setZoom(this.map.getZoom() + 1);
            },

            myZoomOut: function()
            {
                this.map.setZoom(this.map.getZoom() - 1);
            },
        //}


        // アイコン作成メソッド
        //{
            // 実体
            makeIcon: function()
            {
                var icon = new google.maps.MarkerImage(
                    "./images/gicon.png",
                    new google.maps.Size( 30, 36 ),
                    new google.maps.Point( 0, 0 ),
                    new google.maps.Point( 15, 36 )
                );
                return icon;
            },
            // 影
            makeIconShadow: function()
            {
                var icon = new google.maps.MarkerImage(
                    "./images/gicon_shadow.png",
                    new google.maps.Size( 32, 33 ),
                    new google.maps.Point( 0, 0 ),
                    new google.maps.Point( 0, 33 )
                );
                return icon;
            },
            // 数字アイコン
            makeNumIcon: function(n)
            {
                var icon = new google.maps.MarkerImage("//chart.apis.google.com/chart?chst=d_map_pin_letter&chld="+ (n + 1) + "|ff7e73|000000");
                return icon;
            },
            // 数字アイコン影
            makeNumIconShadow: function()
            {
                var icon = new google.maps.MarkerImage("//chart.apis.google.com/chart?chst=d_map_pin_shadow", null, null, new google.maps.Point(12, 35) );
                return icon;
            },
        //}


        // GoogleMap ポイント表示関数（住所から）
        //{
            showAddress: function(addr)
            {
                var geocoder = new google.maps.Geocoder();
                addr = decodeURI(addr);

                if(geocoder) {

                    geocoder.geocode(
                        {address: addr},
                        function(geo_result, geo_response)
                        {
                            if(geo_response == "OK") {
                                var myMetric = myGoogleMap.myOptions.metric;
                                myGoogleMap.myOptions.metric = false;
                                myGoogleMap.createMarker(geo_result[0].geometry.location.lat(), geo_result[0].geometry.location.lng(), true);
                                myGoogleMap.myOptions.metric = myMetric;
                            } else {
                                //alert(geo_response);
                                alert("「" + addr + "」が見つかりませんでした。");
                            }
                        }

                );}
            },
        //}

        // 座標から住所を取得
        //{
            geocodeAddress: "",
            cnvCoord2Address: function(location)
            {
                var geocoder = new google.maps.Geocoder();

                if(geocoder) {

                    geocoder.geocode(
                        {location: location},
                        function(geo_result, geo_response)
                        {
                            if(geo_response == "OK") {

                                var tmpadd = "";
                                tmpadd = geo_result[0].formatted_address.replace("日本, ", "");

                                myGoogleMap.geocodeAddress = tmpadd;

                            } else {
                                //alert(geo_response + "\n\n変換できませんでした。");
                                myGoogleMap.geocodeAddress = geo_response + "\n\n変換できませんでした。";

                            }
                        }

                );}

            },
        //}


        // GoogleMap ポイント表示関数（座標から）
        //{
            createMarker: function(lat, lng, toCenter)
            {
                // 世界測地系に変換
                if(this.myOptions.metric) {
                    var obj = this.cnvCoords(lat, lng, true);
                    lat = obj.lat;
                    lng = obj.lng;
                }

                targetPoint = new google.maps.LatLng(lat, lng);

                this.markerOptions.map = this.map;
                this.markerOptions.position = targetPoint;
                this.markerOptions.icon = this.icon;
                this.markerOptions.shadow = this.icon_shadow;

                var marker = new google.maps.Marker(this.markerOptions);

                // グローバル配列にマーカーを追加
                var i = this.Markers.push(marker);
                i--;

                if(this.markerOptions.enableDelete) {

                    google.maps.event.addListener(marker, "click", function(e)
                    {
                        marker.setMap(null); //マーカーの削除
                        myGoogleMap.Markers.splice(i, 1);

                        // 情報ウィンドウの表示
                        //var iwOptions = {
                        //    content: "test"
                        //};
                        //var infoWindow = new google.maps.InfoWindow(iwOptions);
                        //infoWindow.open(myGoogleMap.map, marker);
                    });

                }

                if(toCenter) this.map.setCenter(targetPoint, this.myOptions.zoom);
            },
        //}


        // 緯度・経度日本測地系・世界測地系(WGS84)ｎ相互変換
        //{
            cnvCoords: function(lat, lng, metric)
            {
                if(metric) {
                    // 世界測地系に変換
                    lat = lat - lat * 0.00010695  + lng * 0.000017464 + 0.0046017;
                    lng = lng - lat * 0.000046038 - lng * 0.000083043 + 0.010040;
                } else {
                    // 日本測地系に変換
                    lat = lat + lat * 0.00010695  - lng * 0.000017464 - 0.0046017;
                    lng = lng + lat * 0.000046038 + lng * 0.000083043 - 0.010040;
                }

                var obj = new Object();
                obj.lat = lat;
                obj.lng = lng;

                return obj;
            },
        //}


        // 座標変換関数
        //{
            calc: function(data)
            {
                var d     = Math.round(data * 360000);
                var dosu  = Math.floor(d / 360000);
                var min   = Math.floor(d / 6000) % 60;
                var sec   = Math.floor(d / 100) % 60;
                var amari = d % 100;
                return dosu + '度' + min + '分' + sec + '.' + amari + '秒' + '[' + data + ']';
            },
        //}


        // 200m範囲内に近接するポイントを離す
        //{
            adjustInterval: function()
            {
                var f = false; // ループ用のフラグ

                // Markers: Array   マーカーポイントを格納した配列
                // mark:    integer マーカーポイントのインデックス

                for(mark in this.Markers) {

                    var m      = this.Markers[mark].position; // [mark]番目の座標を取得
                    var radius = this.calcScope();            // 座標範囲の算出

                    // [mark]番目のポイントを中心とした矩形領域を作成
                    // （緯度経度は北東にいくほど値が大きくなる）
                    //{
                        // 南西の隅
                        var sw = new google.maps.LatLng(m.lat() - radius[0], m.lng() - radius[1]);
                        // 北東の隅
                        var ne = new google.maps.LatLng(m.lat() + radius[0], m.lng() + radius[1]);

                        var llB = new google.maps.LatLngBounds(sw, ne);
                    //}

                    // 他のポイントが境界内に含まれるか
                    //{
                        for(ma in this.Markers) {

                            if(mark != ma) {

                                if(llB.contains(this.Markers[ma].position)) { // 境界内に含まれる

                                    var n = this.Markers[ma].position;
                                    var toLatLng = new google.maps.LatLng(m.lat() + (m.lat() - n.lat()), m.lng() + (m.lng() - n.lng()));

                                    this.Markers[mark].setPosition(toLatLng);

                                    f = true; // ループさせるため、フラグを立てる

                                }

                            }

                        }
                    //}
                }

                // フラグがtrueのとき、再起呼び出し
                //{
                    if(f) {

                        this.timerID = setTimeout("myGoogleMap.adjustInterval()", 100);

                    } else {

                        clearTimeout(this.timerID); // 終了させる

                        if(this.Markers.length > 1) {
                            var coords = this.getAverage();
                            this.map.setCenter(new google.maps.LatLng(coords.lat, coords.lng), this.map.getZoom());
                        }

                    }
                //}
            },
        //}


        // マーカー達の平均緯度経度の算出
        //{
            getAverage: function()
            {
                var lngLat = 0; // 緯度加算用
                var lngLng = 0; // 経度加算用

                // Markers: Array   マーカーポイントを格納した配列
                // mark:    integer マーカーポイントのインデックス

                for(mark in this.Markers) {
                    var m = this.Markers[mark].position; // [mark]番目の座標を取得

                    lngLat += m.lat();
                    lngLng += m.lng();
                }

                lngLat /= this.Markers.length;
                lngLng /= this.Markers.length;

                var obj = new Object();
                obj.lat = lngLat;
                obj.lng = lngLng;

                return obj;
            },
        //}


        // 座標範囲の算出
        //{
            calcScope: function()
            {
                // 座標にて周辺の物件を探す場合の半径（km）
                var radius = 0.2;

                // 緯度1秒の平均距離 約30.9m
                // 緯度35度上の緯度1秒の距離 約30.8m
                //{
                    var lat_length = 30.9;
                //}

                // 緯度35度上の経度1秒の距離 約25m
                //{
                    var lng_length = 25;
                //}

                var rad = radius * 1000; // 半径をm単位に変換

                var lat_scope = (rad / lat_length) / 3600;
                var lng_scope = (rad / lng_length) / 3600;


                var scope = new Array();
                scope[0] = lat_scope;
                scope[1] = lng_scope;

                return scope;
            },
        //}


        // 地図表示領域をマーカー位置に合わせて拡大
        //{
            adjustBounds: function()
            {
                // マーカー1つ以下なら実行しない
                if(this.Markers.length <= 1) {
                    return;
                }

                // 表示領域を生成します。
                var bounds = new google.maps.LatLngBounds();

                // Markers: Array   マーカーポイントを格納した配列
                // mark:    integer マーカーポイントのインデックス

                // 領域に全てのマーカー座標を追加
                for(mark in this.Markers) {
                    bounds.extend (this.Markers[mark].position);
                }

                // 地図表示領域の変更を反映します。
                this.map.fitBounds (bounds);
            },
        //}


        // ルート表示
        //{
            dispRoute: function(startSpot)
            {
                var directionsService = new google.maps.DirectionsService();

                this.requestOptions.origin = startSpot;

                directionsDisplay = new google.maps.DirectionsRenderer({
                    "map": this.map,
                    "preserveViewport": true, //現在のビューを保持する
                    "draggable": true
                });

                directionsService.route(this.requestOptions, function(response, status) {

                    if (status == google.maps.DirectionsStatus.OK) {

                        directionsDisplay.setDirections(response);

                        currentDirections = directionsDisplay.getDirections();
                        var route = currentDirections.routes[0];
                        var s = "";

                        for(var i = 0; i < route.legs.length; i++) {
                            s += route.legs[i].start_address + "から";
                            s += route.legs[i].end_address + "まで\n";
                            s += "距離：" + route.legs[i].distance.text + "\n";
                            s += "かかる時間は約" + route.legs[i].duration.text + "です。";
                        }

                        alert(s);

                    }

                });
            },
        //}


        // 距離計算
        //{
            calcLength: function(startSpot, endSpot)
            {
                var distance = 0;
                var directionsService = new google.maps.DirectionsService();

                this.requestOptions.origin = startSpot;
                this.requestOptions.destination = endSpot;

                directionsDisplay = new google.maps.DirectionsRenderer({
                    "map": this.map,
                    "preserveViewport": true, //現在のビューを保持する
                    "draggable": true
                });

                directionsService.route(this.requestOptions, function(response, status) {

                    if (status == google.maps.DirectionsStatus.OK) {

                        directionsDisplay.setDirections(response);

                        currentDirections = directionsDisplay.getDirections();
                        var route=currentDirections.routes[0];

                        for(var i = 0; i < route.legs.length; i++) {
                            distance = route.legs[i].distance.text;
                            alert(distance);
                        }

                    }

                });

            },
        //}

        // 海抜取得
        //{
            getElevation: function(location, element_id)
            {
                var request = {locations: new Array(location)};

                var myElevation = new google.maps.ElevationService();

                myElevation.getElevationForLocations(request, function(response, status) {

                    if(status == google.maps.ElevationStatus.OK) {
                        var r = Math.round(response[0].elevation * 100) / 100;
                        document.getElementById(element_id).value = r + "m";
                    } else {
                        document.getElementById(element_id).value = "取得できませんでした。";
                    }

                });
            },
        //}

    }
//}
