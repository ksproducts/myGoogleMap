myGoogleMap
====

# Overview
Google Maps JavaScript APIを利用しやすいようにメソッドやプロパティを定義したクラスライブラリ

## Install
ダウンロードしてHTMLに読み込んでください。
* [Download Zip](https://github.com/ksproducts/myGoogleMap/archive/master.zip)

## Requirement
* Google Maps JavaScript API v3+

## Usage

### myGoogleMap
```javascript
myGoogleMap.default_location.lat = 35.658582050535614;
myGoogleMap.default_location.lng = 139.74543124437332;

myGoogleMap.make('map');
```
読み込みが完了している状態で地図を移動させる
```javascript
myGoogleMap.go(35.658582050535614, 139.74543124437332);
```
アニメーションさせる場合
```javascript
myGoogleMap.move(35.658582050535614, 139.74543124437332);
```

### myPolygon
図形を描画して距離や面積を計測するクラス
```javascript
myPolygon.make(myGoogleMap.map);
```
### myStreetView
ストリートビューを表示するクラス
```javascript
myStreetView.make('streetview', 35.658582050535614, 139.74543124437332);
```
