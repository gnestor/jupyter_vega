import React from 'react';
import ReactDOM from 'react-dom';
import Vega from 'jupyterlab_vega_react';
import './index.css';

const VEGA_MIME_TYPE = 'application/vnd.vega.v3+json';
const VEGALITE_MIME_TYPE = 'application/vnd.vegalite.v2+json';
const CLASS_NAME = 'output_Vega rendered_html';

/**
 * Render data to DOM node in output area
 */
function render(props, node) {
  ReactDOM.render(<Vega {...props} />, node);
}

/**
 * Dispose renderer when output area is cleared or removed
 */
function handleClearOutput(event, { cell: { output_area } }) {
  if (output_area.node) ReactDOM.unmountComponentAtNode(output_area.node);
}

/**
 * Register the mime type and append_mime_type function with the notebook's 
 * output_area
 */
export function register_renderer(notebook) {
  // Get an instance of output_area from the notebook object
  const { output_area } = notebook
    .get_cells()
    .reduce((result, cell) => cell.output_area ? cell : result, {});
  // A function to render output of 'application/vnd.vega.v3+json' mime type
  function append_mime(mimetype) {
    return function(data, metadata, element) {
      const toinsert = this.create_output_subarea(
        metadata,
        CLASS_NAME,
        mimetype
      );
      this.node = toinsert[0];
      this.keyboard_manager.register_events(toinsert);
      const props = {
        data,
        metadata: metadata[mimetype],
        mode: mimetype === VEGALITE_MIME_TYPE ? 'vega-lite' : 'vega',
        callback: (error, result) => {
          if (error) return console.log(error);
          // Add a static image output to mime bundle
          result.view
            .toImageURL('png')
            .then(url => {
              const data = url.split(',')[1];
              this.outputs
                .filter(
                  output =>
                    output.data[VEGA_MIME_TYPE] ||
                    output.data[VEGALITE_MIME_TYPE]
                )
                .forEach(output => {
                  output.data['image/png'] = data;
                });
            })
            .catch(error => {
              console.log(error);
            });
        }
      };
      render(props, toinsert[0]);
      element.append(toinsert);
      return toinsert;
    };
  }
  // When an output is cleared,
  output_area.events.on('clear_output.CodeCell', handleClearOutput);
  // Calculate the index of this renderer in `output_area.display_order`
  // e.g. Insert this renderer after any renderers with mime type that matches "+json"
  // const mime_types = output_area.mime_types();
  // const json_types = mime_types.filter(mimetype => mimetype.includes('+json'));
  // const index = mime_types.lastIndexOf(json_types.pop() + 1);
  // // ...or just insert it at the top
  const index = 0;
  // Register the mime type and append_mime_type function with the notebook's output_area
  output_area.register_mime_type(VEGA_MIME_TYPE, append_mime(VEGA_MIME_TYPE), {
    // Is output safe?
    safe: true,
    // Index of renderer in `output_area.display_order`
    index: index
  });
  output_area.register_mime_type(
    VEGALITE_MIME_TYPE,
    append_mime(VEGALITE_MIME_TYPE),
    {
      // Is output safe?
      safe: true,
      // Index of renderer in `output_area.display_order`
      index: index
    }
  );
}

/**
 * Re-render cells with output data of 'application/vnd.vega.v3+json' mime type
 * on load notebook
 */
export function render_cells(notebook) {
  // Get all cells in notebook
  notebook.get_cells().forEach(cell => {
    // If a cell has output data of 'application/geo+json' mime type
    if (
      cell.output_area &&
      cell.output_area.outputs.find(
        output =>
          output.data &&
          (output.data[VEGA_MIME_TYPE] || output.data[VEGALITE_MIME_TYPE])
      )
    ) {
      // Re-render the cell by executing it
      notebook.render_cell_output(cell);
    }
  });
}
