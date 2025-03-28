/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/
import React from 'react';
import ReactDOM from 'react-dom';
import Map from 'ol/Map';
import View from 'ol/View';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import expect from 'expect';
import EffectSupport from '../EffectSupport';
import { waitFor } from '@testing-library/react';

describe("EffectSupport", () => {
    let layer;
    let map;

    beforeEach((done) => {
        document.body.innerHTML = '<div id="container"></div><div id="map" style="width:200px;height:200px;"></div>';
        layer = new VectorLayer({
            msId: "layer-1",
            source: new VectorSource({
                features: [
                    new Feature({
                        geometry: new Point([0, 0])
                    })
                ]
            }),
            visible: true,
            zIndex: 1,
            opacity: 1
        });

        map = new Map({
            view: new View({
                center: [0, 0],
                zoom: 1
            }),
            layers: [layer],
            target: 'map'
        });
        setTimeout(done);
    });

    afterEach((done) => {
        ReactDOM.unmountComponentAtNode(document.getElementById("container"));
        document.body.innerHtml = '';
        layer = null;
        map = null;
        setTimeout(done);
    });

    it('should call getWidth when effect type is cut-vertical', (done) => {
        const sizeMethods = {
            getWidth: () => 500,
            getHeight: () => 250,
            getMousePosition: () => [0, 0]
        };
        const spyGetWidth = expect.spyOn(sizeMethods, 'getWidth');
        const spyGetHeight = expect.spyOn(sizeMethods, 'getHeight');
        const spyGetMousePosition = expect.spyOn(sizeMethods, 'getMousePosition');

        ReactDOM.render(<EffectSupport
            map={map}
            layer="layer-1"
            type="cut-vertical"
            getWidth={sizeMethods.getWidth}
            getHeight={sizeMethods.getHeight}
            circleCutProp={{
                getMousePosition: sizeMethods.getMousePosition,
                radius: 100
            }} />, document.getElementById("container"));
        waitFor(() => expect(document.querySelector('canvas')).toBeTruthy())
            .then(() => {
                const canvas = document.querySelector('canvas');
                const ctx = canvas.getContext('2d');
                layer.listeners_.prerender[0]({context: ctx});

                expect(spyGetWidth).toHaveBeenCalled();
                expect(spyGetHeight).toNotHaveBeenCalled();
                expect(spyGetMousePosition).toNotHaveBeenCalled();
                done();
            })
            .catch(done);
    });

    it('should call getHeight when effect type is cut-horizontal', (done) => {
        const sizeMethods = {
            getWidth: () => 500,
            getHeight: () => 250,
            getMousePosition: () => [0, 0]
        };

        const spyGetWidth = expect.spyOn(sizeMethods, 'getWidth');
        const spyGetHeight = expect.spyOn(sizeMethods, 'getHeight');
        const spyGetMousePosition = expect.spyOn(sizeMethods, 'getMousePosition');

        ReactDOM.render(<EffectSupport
            map={map}
            layer="layer-1"
            type="cut-horizontal"
            getWidth={sizeMethods.getWidth}
            getHeight={sizeMethods.getHeight}
            circleCutProp={{
                getMousePosition: sizeMethods.getMousePosition,
                radius: 100
            }} />, document.getElementById("container"));

        waitFor(() => expect(document.querySelector('canvas')).toBeTruthy())
            .then(() => {
                // Force the layer to call precompose
                const canvas = document.querySelector('canvas');
                const ctx = canvas.getContext('2d');
                layer.listeners_.prerender[0]({context: ctx});

                expect(spyGetWidth).toNotHaveBeenCalled();
                expect(spyGetHeight).toHaveBeenCalled();
                expect(spyGetMousePosition).toNotHaveBeenCalled();
                done();
            })
            .catch(done);
    });

    it('should call getMousePosition when effect type is circle', (done) => {
        const sizeMethods = {
            getWidth: () => 500,
            getHeight: () => 250,
            getMousePosition: () => [0, 0]
        };

        const spyGetWidth = expect.spyOn(sizeMethods, 'getWidth');
        const spyGetHeight = expect.spyOn(sizeMethods, 'getHeight');
        const spyGetMousePosition = expect.spyOn(sizeMethods, 'getMousePosition');

        ReactDOM.render(<EffectSupport
            map={map}
            layer="layer-1"
            type="circle"
            getWidth={sizeMethods.getWidth}
            getHeight={sizeMethods.getHeight}
            circleCutProp={{
                getMousePosition: sizeMethods.getMousePosition,
                radius: 100
            }} />, document.getElementById("container"));

        waitFor(() => expect(document.querySelector('canvas')).toBeTruthy())
            .then(() => {
                // Force the layer to call precompose
                const canvas = document.querySelector('canvas');
                const ctx = canvas.getContext('2d');
                layer.listeners_.prerender[0]({context: ctx, frameState: {pixelRatio: 1}});

                expect(spyGetWidth).toNotHaveBeenCalled();
                expect(spyGetHeight).toNotHaveBeenCalled();
                expect(spyGetMousePosition).toHaveBeenCalled();
                done();
            })
            .catch(done);
    });
});
