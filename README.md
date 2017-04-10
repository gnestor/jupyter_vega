# jupyterlab_vega

A JupyterLab and Jupyter Notebook extension for rendering Vega

![output renderer](http://g.recordit.co/QAsC7YULcY.gif)

## Prerequisites

* JupyterLab ^0.18.0 and/or Notebook >=4.3.0

## Usage

To render Vega output in IPython:

```python
from jupyterlab_vega import Vega

Vega({
    "string": "string",
    "array": [1, 2, 3],
    "bool": True,
    "object": {
        "foo": "bar"
    }
})
```

To render a `.vg` file as a tree, simply open it:

![file renderer](http://g.recordit.co/cbf0xnQHKn.gif)

## Install

```bash
pip install jupyterlab_vega
# For JupyterLab
jupyter labextension install --symlink --py --sys-prefix jupyterlab_vega
jupyter labextension enable --py --sys-prefix jupyterlab_vega
# For Notebook
jupyter nbextension install --symlink --py --sys-prefix jupyterlab_vega
jupyter nbextension enable --py --sys-prefix jupyterlab_vega
```

## Development

```bash
pip install -e .
# For JupyterLab
jupyter labextension install --symlink --py --sys-prefix jupyterlab_vega
jupyter labextension enable --py --sys-prefix jupyterlab_vega
# For Notebook
jupyter nbextension install --symlink --py --sys-prefix jupyterlab_vega
jupyter nbextension enable --py --sys-prefix jupyterlab_vega
```
