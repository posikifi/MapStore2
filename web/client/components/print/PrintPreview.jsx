
/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';

import { Glyphicon } from 'react-bootstrap';
import { pdfjs, Document, Page } from 'react-pdf';
import Button from '../misc/Button';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url
).toString();

class PrintPreview extends React.Component {
    static propTypes = {
        url: PropTypes.string,
        downloadUrl: PropTypes.string,
        scale: PropTypes.number,
        currentPage: PropTypes.number,
        pages: PropTypes.number,
        zoomFactor: PropTypes.number,
        minScale: PropTypes.number,
        maxScale: PropTypes.number,
        back: PropTypes.func,
        setScale: PropTypes.func,
        setPage: PropTypes.func,
        setPages: PropTypes.func,
        style: PropTypes.object,
        buttonStyle: PropTypes.string
    };

    static defaultProps = {
        url: null,
        downloadUrl: null,
        scale: 1.0,
        minScale: 0.25,
        maxScale: 8.0,
        currentPage: 0,
        pages: 1,
        zoomFactor: 2.0,
        back: () => {},
        setScale: () => {},
        setPage: () => {},
        setPages: () => {},
        style: {height: "500px", width: "800px", overflow: "auto", backgroundColor: "#888", padding: "10px"},
        buttonStyle: "default"
    };

    onDocumentComplete = (pages) => {
        this.props.setPages(pages && pages.numPages || 0);
    };

    render() {
        return (
            <div id="mapstore-print-preview-panel">
                <div style={this.props.style}>
                    <Document file={this.props.url}
                        onLoadSuccess={this.onDocumentComplete}>
                        <Page pageNumber={this.props.currentPage + 1} scale={this.props.scale}/>
                    </Document>
                </div>
                <div style={{marginTop: "10px"}}>
                    <Button bsStyle={this.props.buttonStyle} style={{marginRight: "10px"}} onClick={this.props.back}><Glyphicon glyph="arrow-left"/></Button>
                    <Button bsStyle={this.props.buttonStyle} disabled={this.props.scale >= this.props.maxScale} onClick={this.zoomIn}><Glyphicon glyph="zoom-in"/></Button>
                    <Button bsStyle={this.props.buttonStyle} disabled={this.props.scale <= this.props.minScale} onClick={this.zoomOut}><Glyphicon glyph="zoom-out"/></Button>
                    <label style={{marginLeft: "10px", marginRight: "10px"}}>{this.props.scale}x</label>
                    <div className={"print-download btn btn-" + this.props.buttonStyle}><a href={this.props.downloadUrl} target="_blank"><Glyphicon glyph="save"/></a></div>
                    <Button bsStyle={this.props.buttonStyle} disabled={this.props.currentPage === 0} onClick={this.firstPage}><Glyphicon glyph="step-backward"/></Button>
                    <Button bsStyle={this.props.buttonStyle} disabled={this.props.currentPage === 0} onClick={this.prevPage}><Glyphicon glyph="chevron-left"/></Button>
                    <label style={{marginLeft: "10px", marginRight: "10px"}}>{this.props.currentPage + 1} / {this.props.pages}</label>
                    <Button bsStyle={this.props.buttonStyle} disabled={this.props.currentPage === this.props.pages - 1} onClick={this.nextPage}><Glyphicon glyph="chevron-right"/></Button>
                    <Button bsStyle={this.props.buttonStyle} disabled={this.props.currentPage === this.props.pages - 1} onClick={this.lastPage}><Glyphicon glyph="step-forward"/></Button>
                </div>
            </div>
        );
    }

    firstPage = () => {
        if (this.props.currentPage > 0) {
            this.props.setPage(0);
        }
    };

    lastPage = () => {
        if (this.props.currentPage < this.props.pages - 1 ) {
            this.props.setPage(this.props.pages - 1);
        }
    };

    prevPage = () => {
        if (this.props.currentPage > 0) {
            this.props.setPage(this.props.currentPage - 1);
        }
    };

    nextPage = () => {
        if (this.props.currentPage < this.props.pages - 1) {
            this.props.setPage(this.props.currentPage + 1);
        }
    };

    zoomIn = () => {
        this.props.setScale(this.props.scale * this.props.zoomFactor);
    };

    zoomOut = () => {
        this.props.setScale(this.props.scale / this.props.zoomFactor);
    };
}

export default PrintPreview;
