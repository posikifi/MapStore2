/**
 * Copyright 2019, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import expect from 'expect';
import React from 'react';
import ReactDOM from 'react-dom';

import StyleEditorPlugin from '../StyleEditor';
import { getPluginForTest } from './pluginsTestUtils';
import { act } from 'react-dom/test-utils';
import {
    INIT_STYLE_SERVICE,
    TOGGLE_STYLE_EDITOR
} from '../../actions/styleeditor';

describe('StyleEditor Plugin', () => {
    beforeEach((done) => {
        document.body.innerHTML = '<div id="container"></div>';
        setTimeout(done);
    });

    afterEach((done) => {
        ReactDOM.unmountComponentAtNode(document.getElementById("container"));
        document.body.innerHTML = '';
        setTimeout(done);
    });
    it('should use the static service from config', () => {
        const cfgStyleService = {
            baseUrl: 'http://localhost:8080/geoserver/',
            formats: [ 'css', 'sld' ],
            availableUrls: [],
            fonts: [ 'Arial' ]
        };
        const { Plugin, actions } = getPluginForTest(StyleEditorPlugin, {
            styleeditor: {}
        });
        act(() => {
            ReactDOM.render(<Plugin
                active
                styleService={cfgStyleService}
            />, document.getElementById("container"));
        });
        expect(actions.length).toBe(2);
        expect(actions.map(action => action.type))
            .toEqual([ TOGGLE_STYLE_EDITOR, INIT_STYLE_SERVICE ]);
        expect(actions[1].service).toBeTruthy();
        expect(actions[1].service).toEqual({ ...cfgStyleService, isStatic: true });
        expect(actions[1].config.editingAllowedRoles).toEqual(['ADMIN']);
    });
    it('should use the static service from the state', () => {
        const cfgStyleService = {
            baseUrl: 'http://localhost:8080/geoserver/',
            formats: [ 'css', 'sld' ],
            availableUrls: [],
            fonts: [ 'Arial' ]
        };
        const stateStyleService = {
            baseUrl: 'http://localhost:8080/geoserver/',
            formats: [ 'css', 'sld' ],
            availableUrls: [],
            fonts: [ 'Arial' ],
            isStatic: true,
            classificationMethods: {
                raster: ["quantile", "jenks", "equalInterval"],
                vector: ["quantile", "jenks", "equalInterval", "standardDeviation"]
            }
        };
        const { Plugin, actions } = getPluginForTest(StyleEditorPlugin, {
            styleeditor: {
                service: stateStyleService
            }
        });
        const config = {
            "editingAllowedRoles": ["USER"],
            "editingAllowedGroups": ["temp"],
            "enableEditDefaultStyle": false
        };
        act(() => {
            ReactDOM.render(<Plugin
                active
                styleService={cfgStyleService}
                {...config}
            />, document.getElementById("container"));
        });
        expect(actions.length).toBe(2);
        expect(actions.map(action => action.type))
            .toEqual([ TOGGLE_STYLE_EDITOR, INIT_STYLE_SERVICE ]);
        expect(actions[1].service).toBeTruthy();
        expect(actions[1].service).toEqual(stateStyleService);
        expect(actions[1].config).toEqual(config);
    });
    it('should use the service from the state', () => {
        const styleService = {
            baseUrl: 'http://localhost:8080/geoserver/',
            formats: [ 'css', 'sld' ],
            availableUrls: [],
            fonts: [ 'Arial' ]
        };
        const { Plugin, actions } = getPluginForTest(StyleEditorPlugin, {
            styleeditor: {
                service: styleService
            }
        });
        act(() => {
            ReactDOM.render(<Plugin
                active
            />, document.getElementById("container"));
        });
        expect(actions.length).toBe(2);
        expect(actions.map(action => action.type))
            .toEqual([ TOGGLE_STYLE_EDITOR, INIT_STYLE_SERVICE ]);
        expect(actions[1].service).toBeTruthy();
        expect(actions[1].service).toEqual(styleService);
    });
});
