import React from 'react';
import PropTypes from 'prop-types';
import { SketchPicker } from 'react-color';
import { getCategoricalSchemeRegistry, css } from '@superset-ui/core';
import Popover from 'src/components/Popover';
import ControlHeader from '../ControlHeader';

const propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.array,
};

const defaultProps = {
  onChange: () => {},
};

const styles = {
  container: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  colorItem: {
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
    borderRadius: '4px',
    padding: '4px',
    backgroundColor: '#eee',
  },
  colorPopover: {
    width: '24px',
    height: '24px',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  addNew: {
    border: '1px solid gray',
    display: 'flex',
    width: '24px',
    height: '24px',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  removeBtn: {
    cursor: 'pointer',
  },
};

export default class ColorPickerArrayControl extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newColor: '',
    };

    this.onChange = this.onChange.bind(this);
    this.popoverVisibilityChange = this.popoverVisibilityChange.bind(this);
    this.removeColor = this.removeColor.bind(this);
  }

  onChange(col, id) {
    if (id === 'new') {
      this.setState({ newColor: col.hex });
    } else {
      const colors = [...(this.props.value || [])];
      colors[id] = col.hex;
      this.props.onChange(colors);
    }
  }

  removeColor(index) {
    const newColors = this.props.value || [];
    newColors.splice(index, 1);
    this.props.onChange(newColors);
  }

  renderPopover(id, color) {
    const presetColors = getCategoricalSchemeRegistry()
      .get()
      .colors.filter((s, i) => i < 7);
    return (
      <div id={`filter-popover-${id}`} className="color-popover">
        <SketchPicker
          css={css`
            // We need to use important here as these are element level styles
            padding: 0 !important;
            box-shadow: none !important;
          `}
          color={color}
          onChange={col => this.onChange(col, id)}
          presetColors={presetColors}
        />
      </div>
    );
  }

  renderColor(color, index) {
    return (
      <div key={index} style={styles.colorItem}>
        <Popover
          trigger="click"
          placement="right"
          onVisibleChange={this.popoverVisibilityChange}
          content={this.renderPopover(index, color)}
        >
          <div style={{ backgroundColor: color, ...styles.colorPopover }} />
        </Popover>
        <div style={styles.removeBtn} onClick={() => this.removeColor(index)}>
          ✖️
        </div>
      </div>
    );
  }

  popoverVisibilityChange(visible) {
    if (!visible && this.state.newColor) {
      this.props.onChange([...(this.props.value || []), this.state.newColor]);
      this.setState({ newColor: '' });
    }
  }

  render() {
    const colors = Array.isArray(this.props.value)
      ? this.props.value || []
      : [];
    // const c = this.props.value || { r: 0, g: 0, b: 0, a: 0 };
    // const colStyle = {
    //   ...styles.color,
    //   background: `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a})`,
    // };
    return (
      <div>
        <ControlHeader {...this.props} />
        <div style={styles.container}>
          {colors.map((color, i) => this.renderColor(color, i))}
          <Popover
            trigger="click"
            placement="right"
            onVisibleChange={this.popoverVisibilityChange}
            content={this.renderPopover('new', this.state.newColor)}
          >
            <div style={styles.addNew}>➕</div>
          </Popover>
        </div>
      </div>
    );
  }
}

ColorPickerArrayControl.propTypes = propTypes;
ColorPickerArrayControl.defaultProps = defaultProps;
