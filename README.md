# jupyter_vega

A JupyterLab and Jupyter Notebook extension for rendering Vega

![output renderer](http://g.recordit.co/QAsC7YULcY.gif)

## Prerequisites

* JupyterLab ^0.20.0 and/or Notebook >=4.3.0

## Usage

To render Vega output in IPython:

```python
from jupyter_vega import Vega

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
# For JupyterLab
jupyter labextension install jupyter_vega
# For Notebook
pip install jupyter_vega
jupyter nbextension install --py --sys-prefix jupyter_vega
jupyter nbextension enable --py --sys-prefix jupyter_vega
```

## Development

```bash
pip install -e .
# For JupyterLab
cd labextension
jupyter labextension link .
# For Notebook
jupyter nbextension install --symlink --py --sys-prefix jupyter_vega
jupyter nbextension enable --py --sys-prefix jupyter_vega
```
