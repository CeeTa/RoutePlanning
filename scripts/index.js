$(document).ready(function () {
    var map;
    var ajaxRequest;
    var plotlist;
    var plotlayers = [];
    function initmap() {
        // set up the maphttp://210.59.250.227/TPE_TrafficMAP/
        map = new L.Map('map', { preferCanvas: true });
        // create the tile layer with correct attribution
        var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        var osmDarkStyleUrl = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}{r}.png';
        var osmGrayStyleUrl = 'http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png';
        var osmAttrib = 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
        var osm = new L.TileLayer(osmGrayStyleUrl, { minZoom: 8, maxZoom: 19, attribution: osmAttrib });
        // start the map at 25.037566, 121.564431
        map.setView(new L.LatLng(25.037566, 121.564431), 16);
        map.addLayer(osm);
    }
    var StaionObjArray = [];
    function initStation() {
        initTPEStation();
        initNWTStation();
        initTHBStation();
        //showDialog();
    };
    function initTPEStation() {
        $.ajax({
            type: "GET",
            url: 'https://ptx.transportdata.tw/MOTC/v2/Bus/Station/City/Taipei?$select=StationUID%2CStationID%2CStationName%2CStationAddress%2CStationPosition&$format=JSON',
            contentType: "application/json; charset=utf-8",
            headers: GetAuthorizationHeader(),
            //async: false,   
            success: function (data) {
                //console.log(data);
                //PositionLat PositionLon
                $.each(data, function (i, v) {
                    var circle = L.circle([v.StationPosition.PositionLat, v.StationPosition.PositionLon], {
                        color: '#ffbd9d',
                        fillColor: '#ffbd9d',
                        fillOpacity: 0.9,
                        radius: 5
                    }).addTo(map);
                    circle.bindTooltip(v.StationName.Zh_tw + '<br>' + v.StationAddress, { direction: 'top', offset: [0, -5] });
                    var StationObj = { UID: v.StationUID, ID: v.StationID, X: v.StationPosition.PositionLon, Y: v.StationPosition.PositionLat };
                    //StationIDArray.push(v.StationID);
                    StaionObjArray.push(StationObj);
                });
                //console.log(StaionObjArray);
            }
        })
    };
    function initNWTStation() {
        $.ajax({
            type: "GET",
            url: 'https://ptx.transportdata.tw/MOTC/v2/Bus/Station/City/NewTaipei?$select=StationUID%2CStationID%2CStationName%2CStationAddress%2CStationPosition&$format=JSON',
            contentType: "application/json; charset=utf-8",
            headers: GetAuthorizationHeader(),
            //async: false,
            success: function (data) {
                $.each(data, function (i, v) {
                    //var StationID = v.StationID.toString();
                    //if (StationIDArray.includes(StationID) == false) {
                    var circle = L.circle([v.StationPosition.PositionLat, v.StationPosition.PositionLon], {
                        color: '#fff4c1',
                        fillColor: '#fff4c1',
                        fillOpacity: 0.9,
                        radius: 5
                    }).addTo(map);
                    circle.bindTooltip(v.StationName.Zh_tw + '<br>' + v.StationAddress, { direction: 'top', offset: [0, -5] });
                    var StationObj = { UID: v.StationUID, ID: v.StationID, X: v.StationPosition.PositionLon, Y: v.StationPosition.PositionLat };
                    //StationIDArray.push(v.StationID);
                    StaionObjArray.push(StationObj);
                    //};
                });
            }
        })
    };
    function initTHBStation() {
        $.ajax({
            type: "GET",
            url: 'https://ptx.transportdata.tw/MOTC/v2/Bus/Station/InterCity?$select=StationUID%2CStationID%2CStationName%2CStationPosition&$format=JSON',
            contentType: "application/json; charset=utf-8",
            headers: GetAuthorizationHeader(),
            //async: false,
            success: function (data) {
                $.each(data, function (i, v) {
                    //var StationID = v.StationID.toString();
                    //if (StationIDArray.includes(StationID) == false) {
                    var circle = L.circle([v.StationPosition.PositionLat, v.StationPosition.PositionLon], {
                        color: '#97cbff',
                        fillColor: '#97cbff',
                        fillOpacity: 0.9,
                        radius: 5
                    }).addTo(map);
                    circle.bindTooltip(v.StationName.Zh_tw, { direction: 'top', offset: [0, -5] });
                    var StationObj = { UID: v.StationUID, ID: v.StationID, X: v.StationPosition.PositionLon, Y: v.StationPosition.PositionLat };
                    //StationIDArray.push(v.StationID);
                    StaionObjArray.push(StationObj);
                    //};
                });
                //console.log(StaionObjArray);
            }
        })
    };
    function showDialog() {
        try { $("#dialog-modal").dialog("close"); }
        catch (e) { }
        var _dialog =
            $("#dialog-modal").dialog({
                maxHeight: 400,
                width: 800,
                //width: 200,
                closeOnEscape: false,
                modal: true,
                //closeText: "X",
                buttons: {
                    "Save": function () {
                        var blob = new Blob([$('#dialog-modal').html()], {
                            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
                        });
                        var strFile = "Report.xls";
                        saveAs(blob, strFile);
                        return false;
                    }
                }
            }).dialogExtend({
                "maximizable": false,
                "minimizable": true,
                "minimize": function (evt, dlg) {
                    $('#dialog-extend-fixed-container .ui-dialog').css('width', '300px');
                },
            });
        //$('.ui-dialog').keydown(function (evt) {
        //    if (evt.keyCode === $.ui.keyCode.ESCAPE) {
        //        console.log(_dialog);
        //        _dialog.dialog('close');
        //    }
        //    evt.stopPropagation();
        //});
        $('.ui-dialog-buttonpane')
            .find('button:contains("Save")')
            .html('')
            .prepend('<span class="glyphicon glyphicon-floppy-save"></span>')
            .css('position', 'absolute').css('right', '0.5%').css('bottom', '0.5%').css('background-color', '#fff')
            .css('border', '1px solid transparent').css('border-color', '#ccc').css('border-radius', '6px').css('width', '25px').attr('title', '下載');
        $('.ui-dialog-titlebar-minimize').attr('title', '縮小');
        $('.ui-dialog-titlebar-maximize').attr('title', '放大');
        $('.ui-dialog-titlebar-close').attr('title', '關閉');
        $('.ui-dialog-titlebar-restore .ui-icon').attr('title', '還原');
        $("#dialog-modal").show();
    };
    function StartQuery(area, _selectedStaion) {
        //leafletPip.pointInLayer([-88.1354, 38.55555555], _tempLayer);
        var _subRouteIDArray = [];
        var _routeIDArray = [];
        _itemArray = [];
        var _obj = { RouteID: "", SubRouteID: "", SubRouteName: "", StationID: "", StationName: "", StationSequence: "", StartPoint: null, EndPoint: null, OriginWKT: "", EncodedDirectionPolyline: "", Instruction: "", DistanceDif: "", Direction: "" };
        var RouteWKT = new Object();
        var StopOfSubRoute = new Object();

        for (z = 0; z < 3; z++) {
            $.each(_selectedStaion[z], function (i, v) {
                var _stationID = v;
                var _uri = '';
                if (z == 0) {
                    _uri = "https://ptx.transportdata.tw/MOTC/v2/Bus/StopOfRoute/City/Taipei?$select=RouteID%2CSubRouteID%2CSubRouteName%2CStops&$filter=Stops%2Fany(d%3Ad%2FStationID%20eq%20'" + _stationID + "')&$format=JSON";
                }
                else if (z == 1) {
                    _uri = "https://ptx.transportdata.tw/MOTC/v2/Bus/StopOfRoute/City/NewTaipei?$select=RouteID%2CSubRouteID%2CSubRouteName%2CStops&$filter=Stops%2Fany(d%3Ad%2FStationID%20eq%20'" + _stationID + "')&$format=JSON";
                }
                else if (z == 2) {
                    _uri = "https://ptx.transportdata.tw/MOTC/v2/Bus/StopOfRoute/InterCity?$select=RouteID%2CSubRouteID%2CSubRouteName%2CStops&$filter=Stops%2Fany(d%3Ad%2FStationID%20eq%20'" + _stationID + "')&$format=JSON";
                }
                $.ajax({
                    type: "GET",
                    url: _uri,
                    async: false,
                    contentType: "application/json; charset=utf-8",
                    headers: GetAuthorizationHeader(),
                    success: function (data) {
                        $.each(data, function (idx, val) {
                            if (_routeIDArray.includes(val.RouteID) == false) {
                                _routeIDArray.push(val.RouteID);
                                var uri = '';
                                if (z == 0) {
                                    uri = "https://ptx.transportdata.tw/MOTC/v2/Bus/Shape/City/Taipei?$select=Geometry&$filter=RouteID%20eq%20'" + val.RouteID + "'&$format=JSON";
                                }
                                else if (z == 1) {
                                    uri = "https://ptx.transportdata.tw/MOTC/v2/Bus/Shape/City/NewTaipei?$select=Geometry&$filter=RouteID%20eq%20'" + val.RouteID + "'&$format=JSON";
                                }
                                else if (z == 2) {
                                    uri = "";
                                }
                                $.ajax({
                                    type: "GET",
                                    url: uri,
                                    async: false,
                                    contentType: "application/json; charset=utf-8",
                                    headers: GetAuthorizationHeader(),
                                    success: function (data) {
                                        RouteWKT[val.RouteID] = data[0].Geometry;
                                    }
                                });
                            }
                            var SubRouteIDWithDirection = val.SubRouteID + "_" + val.Direction;
                            if (_subRouteIDArray.includes(SubRouteIDWithDirection) == false) {
                                _subRouteIDArray.push(SubRouteIDWithDirection);
                                StopOfSubRoute[SubRouteIDWithDirection] = val.Stops;
                            }
                            var obj = Object.create(_obj);
                            obj.RouteID = val.RouteID;
                            obj.SubRouteID = val.SubRouteID;
                            obj.SubRouteName = val.SubRouteName.Zh_tw;
                            obj.StationID = _stationID;
                            obj.OriginWKT = RouteWKT[val.RouteID];
                            obj.Direction = val.Direction;
                            $.each(val.Stops, function (_idx, _val) {
                                if (_val.StationID == obj.StationID) {
                                    obj.StationName = _val.StopName.Zh_tw;
                                    obj.StationSequence = _val.StopSequence;
                                }
                            });
                            _itemArray.push(obj);
                        });
                    }
                })
            });
        }
        //console.log(_itemArray);
        //console.log(_subRouteIDArray);
        $.each(_itemArray, function (i, v) {
            var sequence = v.StationSequence;
            var SubRouteIDWithDirection = v.SubRouteID + "_" + v.Direction;
            var count = StopOfSubRoute[SubRouteIDWithDirection].length;
            var lastSequence = StopOfSubRoute[SubRouteIDWithDirection][count - 1].StopSequence;
            var sPoint = [];
            var ePoint = [];
            if (sequence == 1) {
                //console.log(v.SubRouteID);
                //console.log('sequence:' + sequence + ',count:' + count);
                //_itemArray.splice(i, 1);
                return
            }
            else if (sequence == lastSequence) {
                //console.log(v.SubRouteID);
                //console.log('sequence:' + sequence + ',count:' + count);
                //_itemArray.splice(i, 1);
                return
            }
            else {
                //console.log(v.SubRouteID);
                //console.log(StopOfSubRoute[v.SubRouteID]);
                var SubRouteIDWithDirection = v.SubRouteID + "_" + v.Direction;
                $.each(StopOfSubRoute[SubRouteIDWithDirection], function (idx, val) {
                    if (sequence - 1 == val.StopSequence) {
                        sPoint[0] = val.StopPosition.PositionLon;
                        sPoint[1] = val.StopPosition.PositionLat;
                        _itemArray[i].StartPoint = sPoint;
                    }
                    else if (sequence + 1 == val.StopSequence) {
                        ePoint[0] = val.StopPosition.PositionLon;
                        ePoint[1] = val.StopPosition.PositionLat;
                        _itemArray[i].EndPoint = ePoint;
                    }
                    else {
                    }
                });
            }
        });
        for (i = _itemArray.length - 1; i >= 0; i--) {
            if (_itemArray[i].StartPoint == null || _itemArray[i].EndPoint == null) {
                //console.log('[Error]SubRouteID:' + _itemArray[i].SubRouteID + ', which StationSequence:' + _itemArray[i].StationSequence + ", StartPoint:" + _itemArray[i].StartPoint + ", EndPoint:" + _itemArray[i].EndPoint);
                _itemArray.splice(i, 1);
            }
        }

        $('#dialog-modal tbody').html('');
        function compareWithSubRouteID(a, b) {
            if (a.SubRouteID < b.SubRouteID)
                return -1;
            if (a.SubRouteID > b.SubRouteID)
                return 1;
            return 0;
        }
        function compareWithSequence(a, b) {
            if (a.StationSequence < b.StationSequence)
                return -1;
            if (a.StationSequence > b.StationSequence)
                return 1;
            return 0;
        }
        _itemArray.sort(compareWithSubRouteID);
        //console.log(_itemArray);
        var _itemArrayFix = [];
        $.each(_subRouteIDArray, function (i, v) {
            var array = [];
            $.each(_itemArray, function (_i, _v) {
                if (v == _v.SubRouteID + '_' + _v.Direction) {
                    array.push(_v);
                }
            });
            array.sort(compareWithSequence);
            var perviousItem = null;
            var pervisousSequence = 0;
            for (j = 0; j < array.length; j++) {
                if (array.length == 1) {
                    _itemArrayFix.push(array[0]);
                }
                else {
                    if (j == 0) {
                        perviousItem = array[0];
                        pervisousSequence = array[0].StationSequence;
                    }
                    else {
                        if (array[j].StationSequence - 1 == pervisousSequence) {
                            perviousItem.StationName += ',' + array[j].StationName;
                            perviousItem.StationID += ',' + array[j].StationID;
                            perviousItem.StationSequence += ',' + array[j].StationSequence;
                            perviousItem.EndPoint = array[j].EndPoint;
                            pervisousSequence = array[j].StationSequence;
                        }
                        else {
                            _itemArrayFix.push(perviousItem);
                            perviousItem = array[j];
                            pervisousSequence = array[j].StationSequence;
                        }
                        if (j == array.length - 1) {
                            _itemArrayFix.push(perviousItem);
                        }
                    }
                }
            }
        })

        //console.log(_itemArrayFix);

        $.each(_itemArrayFix, function (_i, _v) {
            var _str_avoid_polygons = '{"avoid_features": "tracks","avoid_polygons":{"type":"Polygon","coordinates":[[';
            var _first_coordinates = "";
            var _polygon = "[";
            $.each(area, function (i, v) {
                if (i % 10 == 2) {
                    _str_avoid_polygons += '[' + v.lng + ',' + v.lat + '],';
                    _polygon += ',[' + v.lat + ',' + v.lng + ']';
                }
                else if (i == 0) {
                    _first_coordinates = '[' + v.lng + ',' + v.lat + ']';
                    _str_avoid_polygons += _first_coordinates + ',';
                    _polygon += '[' + v.lat + ',' + v.lng + ']';
                }
            })
            _str_avoid_polygons += _first_coordinates + ']]}}';
            _polygon += "]";
            //if (_i == 1) { 
            //    openRouteService(_v,_str_avoid_polygons);
            //}

            openRouteService(_v, _str_avoid_polygons);

            //var _rdm = getRandom(15000, 25000);
            var _rdm = 20000;
            //20km/hr
            var _timeDiff = ((parseInt(_v.DistanceDif) / _rdm * 60)).toFixed(1);
            if (_timeDiff < 1) {
                _timeDIff = "小於一分鐘";
            }
            //<th>改道公車</th><th>影響站位</th><th>改道路線</th><th>距離差異(公尺)</th><th>時間差異(分)</th>
            var SubRouteNameWithDriection = "";
            if (_v.Direction == 0) {
                SubRouteNameWithDriection = _v.SubRouteName + "(去程)";
            } else if (_v.Direction == 1) {
                SubRouteNameWithDriection = _v.SubRouteName + "(返程)";
            }
            if (_v.Instruction == "") { }
            else {
                $('#dialog-modal tbody').append('<tr' + ' id=' + "tableRow_" + _i + '><td>' + SubRouteNameWithDriection + '</td><td>' + _v.StationName + '</td><td>' + _v.Instruction + '</td><td>' + _v.DistanceDif + '</td><td>' + _timeDiff + '</td></tr>');
            }
        });
        $('#dialog-modal tbody tr').click(function (e) {
            if (OriginPolyline != null) {
                map.removeLayer(OriginPolyline);
            }
            if (DirectionPolyline != null) {
                map.removeLayer(DirectionPolyline);
            }
            var _str = e.currentTarget.id;
            var _split = _str.split('_');
            var _id = _split[1];
            //if (_itemArray[_id].OriginWKT.length > 0) { 
            //}
            try {
                OriginPolyline = drawWkt(_itemArrayFix[_id].OriginWKT);
            }
            catch (e) { };
            DirectionPolyline = drawEncodedpolyline(_itemArrayFix[_id].EncodedDirectionPolyline);
        });
        $('#btnDraw').removeClass('selected');

        $('.loader').css('visibility', 'hidden');
        $('#btnSubmit').addClass('disabled');
        selectfeature.disable();
        selectfeatureEnable = false;
        showDialog();
        //console.log(_itemArray);
        //console.log(StopOfSubRoute);

    }
    function GetAuthorizationHeader() {
        var AppID = '6fa41fdd4768445796e6616251609648';
        var AppKey = 'AYlzlwsYEA8gamqCwxy8Pg2cc38';

        var GMTString = new Date().toGMTString();
        var ShaObj = new jsSHA('SHA-1', 'TEXT');
        ShaObj.setHMACKey(AppKey, 'TEXT');
        ShaObj.update('x-date: ' + GMTString);
        var HMAC = ShaObj.getHMAC('B64');
        var Authorization = 'hmac username=\"' + AppID + '\", algorithm=\"hmac-sha1\", headers=\"x-date\", signature=\"' + HMAC + '\"';

        return { 'Authorization': Authorization, 'X-Date': GMTString /*,'Accept-Encoding': 'gzip'*/ }; //如果要將js運行在伺服器，可額外加入 'Accept-Encoding': 'gzip'，要求壓縮以減少網路傳輸資料量
    }
    function openRouteService(item, _str_avoid_polygons) {
        //console.log(_str_avoid_polygons);
        //console.log(item.SubRouteID);
        //$('#loaderText').text(item.SubRouteID);
        try {
            var _url = "https://api.openrouteservice.org/directions";
            var _key = "5b3ce3597851110001cf6248d2f8ecea2f184ec88c3e853ce544667c";
            var _startPosition = item.StartPoint[0] + "," + item.StartPoint[1];
            var _endPostion = item.EndPoint[0] + "," + item.EndPoint[1];
            var _profile = "driving-car";
            _url += "?api_key=" + _key + "&coordinates=" + _startPosition + "|" + _endPostion + "&profile=" + _profile + "&options=" + _str_avoid_polygons;

            //_url = "http://192.168.99.220:8000/ors/routes?attributes=detourfactor%7Cpercentage&coordinates=121.471033,25.05875%7C121.481867,25.062294&elevation=true&extra_info=steepness%7Cwaytype%7Csurface&geometry=true&geometry_format=geojson&instructions=true&instructions_format=html&language=en-US&options=%7B%22avoid_polygons%22:%7B%22type%22:%22Polygon%22,%22coordinates%22:%5B%5B%5B%22121.47965%22,%2225.06200%22%5D,%5B%22121.47907%22,%2225.06091%22%5D,%5B%22121.48108%22,%2225.06072%22%5D,%5B%22121.48102%22,%2225.06225%22%5D,%5B%22121.47965%22,%2225.06200%22%5D%5D%5D%7D%7D&preference=fastest&profile=driving-car&units=m";
            //var _url = "http://192.168.99.220:8000/ors/routes?attributes=detourfactor%7Cpercentage";
            //_url += "&coordinates=" + _startPosition + "|" + _endPostion + "&profile=" + _profile + "&options=" + _str_avoid_polygons;
            //+ "&units=m&preference=fastest&language=en-US&instructions_format=html&geometry=true&geometry_format=geojson&instructions=true&extra_info=steepness%7Cwaytype%7Csurface&elevation=true";
            //console.log(_url);
            var _encodedpolyline = "";
            $.ajax({
                type: "GET",
                url: _url,
                async: false,
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    //console.log(data);
                    _encodedpolyline = data.routes[0].geometry;
                    item.EncodedDirectionPolyline = _encodedpolyline;
                    var _instruction = "";
                    $.each(data.routes[0].segments[0].steps, function (i, v) {
                        if (i == 0) {
                            _instruction += v.name;
                        }
                        else if (i != 0 && v.name != "") {
                            _instruction += "→" + v.name;
                        }
                    });
                    var _d = getDistanceFromLatLonInKm(item.StartPoint[1], item.StartPoint[0], item.EndPoint[1], item.EndPoint[0]);
                    var _dDiff = data.routes[0].summary.distance - _d * 1000;
                    item.Instruction = _instruction;
                    item.DistanceDif = _dDiff.toFixed(3);
                    //console.log(L.PolylineUtil.decode(_encodedpolyline, 5));
                    //var polyline = L.polyline(L.PolylineUtil.decode(_encodedpolyline, 5), { color: "red" }).addTo(map);
                    //map.fitBounds(polyline.getBounds());
                    return item;
                }
            })
        }
        catch (ex) { console.log(ex); }
    };
    function drawWkt(_WKTString) {
        var wkt = new Wkt.Wkt();
        wkt.read(_WKTString);
        //console.log(wkt.components);
        var _polylineArray = [];
        $.each(wkt.components, function (i, v) {
            var _p = [];
            _p[0] = v.y;
            _p[1] = v.x;
            _polylineArray.push(_p);
        })
        var polyline = L.polyline(_polylineArray, { color: "yellow" }).addTo(map);
        return polyline;
    }
    function drawEncodedpolyline(_encodedpolylineString) {
        var polyline = L.polyline(L.PolylineUtil.decode(_encodedpolylineString, 5), { color: "red" }).addTo(map);
        map.fitBounds(polyline.getBounds());
        return polyline;
    }
    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2 - lat1);  // deg2rad below
        var dLon = deg2rad(lon2 - lon1);
        var a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    }
    function deg2rad(deg) {
        return deg * (Math.PI / 180)
    }
    function getRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    initmap();
    initStation();
    //showDialog();
    var selectfeature;
    var selectfeatureEnable = false;
    $('#btnDraw').click(function () {
        var _selected = $('#btnDraw').hasClass('selected');
        if (_selected == false) {
            $('#btnDraw').addClass('selected');
            selectfeature = map.selectAreaFeature.enable();
            selectfeatureEnable = true;
        }
        else {
            $('#btnDraw').removeClass('selected');
            selectfeature.disable();
            selectfeatureEnable = false;
        }
    });
    $('#btnClear').click(function () {
        selectfeature.removeAllArea();
        if (OriginPolyline != null) {
            map.removeLayer(OriginPolyline);
        }
        if (DirectionPolyline != null) {
            map.removeLayer(DirectionPolyline);
        }
        $('#btnClear').addClass('disabled');
        $('#btnSubmit').addClass('disabled');
    });
    $('#btnSubmit').click(function () {
        if (selectfeatureEnable == true) {
            $('.loader').css('visibility', 'visible');
            //$('#loaderText').text(55555);
            setTimeout(function () {
                var _tempGeoJSON = L.polygon(area, { color: 'blue' }).toGeoJSON();
                var _tempLayer = L.geoJson(_tempGeoJSON);
                var _selectedStaion = [];
                var _selectedTPEStation = [];
                var _selectedNWTStation = [];
                var _selectedTHBStation = [];

                $.each(StaionObjArray, function (i, v) {
                    var _point = [];
                    _point[0] = v.X;
                    _point[1] = v.Y;
                    var _contain = leafletPip.pointInLayer(_point, _tempLayer);
                    if (_contain.length > 0) {
                        _stationID = v.ID;
                        _stationUID = v.UID;
                        _substring = _stationUID.substring(0, 3);
                        if (_substring == "TPE") {
                            _selectedTPEStation.push(_stationID);
                        }
                        else if (_substring == "NWT") {
                            _selectedNWTStation.push(_stationID);
                        }
                        else if (_substring == "THB") {
                            _selectedTHBStation.push(_stationID);
                        }
                    }
                });

                _selectedStaion.push(_selectedTPEStation);
                _selectedStaion.push(_selectedNWTStation);
                _selectedStaion.push(_selectedTHBStation);
                //console.log(_selectedStaion);
                if (_selectedStaion.length == 0) {
                    $('.loader').css('visibility', 'hidden');
                    alert('無框選到任何站位!');
                }
                else {
                    StartQuery(area, _selectedStaion);
                }
            }, 50);
        }
    });
    $('#map').mousedown(function () {
        if (selectfeatureEnable == true) {
            selectfeature.removeAllArea();
        }
    })
    var _itemArray;
    var OriginPolyline = null;
    var DirectionPolyline = null;
    var area;
    $('#map').mouseup(function () {
        if (selectfeatureEnable == true) {
            area = selectfeature.getAreaLatLng();
            //console.log(area);
            $('#btnClear').removeClass('disabled');
            $('#btnSubmit').removeClass('disabled');
        }
    });
})
