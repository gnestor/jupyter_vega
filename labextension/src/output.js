import { Widget } from '@phosphor/widgets';
import React from 'react';
import ReactDOM from 'react-dom';
import Vega from 'jupyterlab_vega_react';

/**
 * The class name added to this OutputWidget.
 */
const VEGA_MIME_TYPE = 'application/vnd.vega.v3+json';
const VEGALITE_MIME_TYPE = 'application/vnd.vegalite.v2+json';
const CLASS_NAME = 'jp-OutputWidgetVega';

/**
 * A widget for rendering Vega.
 */
export class OutputWidget extends Widget {
  constructor(options) {
    super();
    this.addClass(CLASS_NAME);
    this._data = options.model.data;
    // this._metadata = options.model.metadata.get(options.mimeType);
    this._mimeType = options.mimeType;
  }

  /**
   * A message handler invoked on an `'after-attach'` message.
   */
  onAfterAttach(msg) {
    this._render();
  }

  /**
   * A message handler invoked on an `'before-detach'` message.
   */
  onBeforeDetach(msg) {
    ReactDOM.unmountComponentAtNode(this.node);
  }

  /**
   * A render function given the widget's DOM node.
   */
  _render() {
    const data = this._data.get(this._mimeType);
    // const metadata = this._metadata.get(this._mimeType);
    const props = {
      data,
      // metadata,
      embedMode: this._mimeType === VEGALITE_MIME_TYPE
        ? 'vega-lite'
        : 'vega',
      renderedCallback: (error, result) => {
        if (error) return console.log(error);
        // Add a static image output to mime bundle
        result.view
          .toImageURL('png')
          .then(url => {
            const data = url.split(',')[1];
            this._data.set('image/png', data)
          })
          .catch(error => {
            console.log(error);
          });
      }
    };
    ReactDOM.render(<Vega {...props} />, this.node);
  }
}

export class VegaOutput {
  /**
   * The mime types this OutputRenderer accepts.
   */
  mimeTypes = [VEGA_MIME_TYPE];

  /**
   * Whether the renderer can render given the render options.
   */
  canRender(options) {
    return this.mimeTypes.indexOf(options.mimeType) !== -1;
  }

  /**
   * Render the transformed mime bundle.
   */
  render(options) {
    return new OutputWidget(options);
  }
}

export class VegaLiteOutput {
  /**
   * The mime types this OutputRenderer accepts.
   */
  mimeTypes = [VEGALITE_MIME_TYPE];

  /**
   * Whether the renderer can render given the render options.
   */
  canRender(options) {
    return this.mimeTypes.indexOf(options.mimeType) !== -1;
  }

  /**
   * Render the transformed mime bundle.
   */
  render(options) {
    return new OutputWidget(options);
  }
}
