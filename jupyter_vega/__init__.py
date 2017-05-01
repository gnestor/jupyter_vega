from IPython.display import display, JSON

# Running `npm run build` will create static resources in the static
# directory of this Python package (and create that directory if necessary).

def _jupyter_labextension_paths():
    return [{
        'name': 'jupyter_vega',
        'src': 'static',
    }]

def _jupyter_nbextension_paths():
    return [{
        'section': 'notebook',
        'src': 'static',
        'dest': 'jupyter_vega',
        'require': 'jupyter_vega/extension'
    }]

# A display class that can be used within a notebook. 
#   from jupyter_vega import Vega
#   Vega(data)
    
class Vega(JSON):
    """A display class for displaying Vega visualizations in the Jupyter Notebook and IPython kernel.
    
    Vega expects a JSON-able dict, not serialized JSON strings.

    Scalar types (None, number, string) are not allowed, only dict containers.
    """

    def _ipython_display_(self):
        bundle = {
            'application/vnd.vega.v2+json': self.data,
            'text/plain': '<jupyter_vega.Vega object>'
        }
        metadata = {
            'application/vnd.vega.v2+json': self.metadata
        }
        display(bundle, metadata=metadata, raw=True) 
