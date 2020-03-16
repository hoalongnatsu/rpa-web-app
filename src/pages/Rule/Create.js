import './Create.scss';

import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import uuid from 'uuid/v1';
import { fromEvent } from 'rxjs';
import { concatMap, takeUntil } from 'rxjs/operators';

/* Components */
import Icon from 'components/Icon';
import PopupAddName from 'components/Popup/AddName';
import Modal from 'components/Modal';
import ModalChooseKeyValueFilter from 'components/Modal/ChooseKeyValueFilter';
import Overlay from 'components/Loading/Overlay';
import ZoneORCList from 'components/Rule/Create/ZoneORCList';
import ResultView from 'components/Parse/ResultView';

/* Helpers */
import {
  getMousePositionInCanvas,
  drawBox,
  transformCoordinatesCanvasToCoordinatesImage,
  checkCoordinatesInExistBox,
  findBoxByCoordinates
} from 'helpers/canvas';

/* Services */
import { rules } from 'services/rules';

/* Actions */
import { add_rule } from 'actions/rules';

export class Create extends Component {

  canvas;
  ctx;
  image;
  zoneORCItem = {};

  state = {
    popup: {
      top: 0,
      left: 0,
      show: false,
      dataFieldName: ''
    },
    modal: {
      chooseKeyFilter: false,
      review: false,
    },
    zoneORC: [],
    keyFilter: [],
    table: [],
    name: "Business card parser",
    engine_type: 0,
    base64: null,
    loading: false,
    reviewResult: null,
  }

  componentWillMount() {
    const { state } = this.props.location;
    if (state && state.name && state.image) {
      this.setState({name: state.name, base64: state.image, engine_type: state.engine_type});
      return;
    }

    this.props.history.push('/')
  }

  componentDidMount() {
    const { base64 } = this.state;

    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.image = new Image();
    this.image.src = base64;
    // this.image.src = '/images/invoice_1.png';

    this.image.onload = () => {
      const resizeHeight = (700*this.image.height)/this.image.width;
      this.canvas.height = resizeHeight;
      this.ctx.drawImage(this.image, 0, 0, 700, resizeHeight);
    }

    this.triggerBoxingFunction();
  }

  /* Boxing function */
  triggerBoxingFunction = () => {
    this.canvas.style.cursor = 'crosshair';

    const mousedown$ = fromEvent(this.canvas, 'mousedown');
    const mousemove$ = fromEvent(this.canvas, 'mousemove');
    const mouseup$ = fromEvent(this.canvas, 'mouseup');

    mousedown$.subscribe(e => {
      const { zoneORC } = this.state;
      const { x, y } = getMousePositionInCanvas(this.canvas, e);

      // Check if click on exist box
      if (checkCoordinatesInExistBox(zoneORC, x, y)) {
        this.zoneORCItem = findBoxByCoordinates(zoneORC, x, y);
        this.zoneORCItem.x_click = x;
        this.zoneORCItem.y_click = y;
        this.zoneORCItem.move = true;

        zoneORC.forEach((item) => {
          if (item.show) drawBox(this.ctx, item);
        })

        return;
      }

      // If not then create new item to draw
      this.zoneORCItem = {
        _id: uuid(),
        x_min: x, y_min: y, x_max: x, y_max: y, x_click: x, y_click: y,
        show: true, edit: false, move: false
      };

      /* Popup */
      const popup = {left: 0, top: 0, show: false, dataFieldName: ''};
      this.setState({popup});
    })

    mousemove$.subscribe(e => {
      const { zoneORC } = this.state;
      const { x, y } = getMousePositionInCanvas(this.canvas, e);
      
      if (checkCoordinatesInExistBox(zoneORC, x, y)) {
        this.canvas.style.cursor = 'move'
      } else {
        this.canvas.style.cursor = 'crosshair';
      }
    })

    mousedown$.pipe(
      concatMap(() => mousemove$.pipe(takeUntil(mouseup$)))
    ).subscribe((e) => {
      const { zoneORC } = this.state;
      const { x, y } = getMousePositionInCanvas(this.canvas, e);

      // Clear canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);

      if (this.zoneORCItem.move) {
        const { x_min, y_min, x_max, y_max, x_click, y_click } = this.zoneORCItem;
        const x_add = x - x_click;
        const y_add = y - y_click;

        // Update new x_min, y_min, x_max, y_max of exist box
        this.zoneORCItem.x_min = x_min + x_add;
        this.zoneORCItem.y_min = y_min + y_add;
        this.zoneORCItem.x_max = x_max + x_add;
        this.zoneORCItem.y_max = y_max + y_add;
        this.zoneORCItem.x_click = x_click + x_add;
        this.zoneORCItem.y_click = y_click + y_add;
      } else {
        this.zoneORCItem.x_max = x;
        this.zoneORCItem.y_max = y;
        drawBox(this.ctx, this.zoneORCItem);
      }

      /* Redraw box */
      zoneORC.forEach((item) => {
        if (item.show) drawBox(this.ctx, item);
      })
    })

    mouseup$.subscribe(e => {
      const { zoneORC } = this.state;
      const { x, y } = getMousePositionInCanvas(this.canvas, e);

      if (this.zoneORCItem.move) {
        this.zoneORCItem.move = false;

        zoneORC.forEach((item) => {
          if (item.show) drawBox(this.ctx, item);
        })

        return;
      }

      // Update x_max, y_max of rectangle, stop draw
      this.zoneORCItem.x_max = x;
      this.zoneORCItem.y_max = y;

      // Show popup to add zoneORC data field name 
      const popup = {left: e.clientX, top: e.clientY, show: true, dataFieldName: ''}
      this.setState({popup});
    })
  }

  // Interact with zoneORC
  toggleZoneORCItem = (index) => {
    const { zoneORC } = this.state;
    const newZoneORC = [...zoneORC];

    newZoneORC[index].show = !newZoneORC[index].show;
    this.setState({zoneORC: newZoneORC});

    /* Redraw canvas */
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
    newZoneORC.forEach((item) => {
      if (item.show) drawBox(this.ctx, item);
    })
  }

  editZoneORCItem = (index) => {
    const { zoneORC } = this.state;
    const newZoneORC = [...zoneORC];

    newZoneORC[index].edit = true;
    this.setState({zoneORC: newZoneORC});

    /* Redraw canvas */
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
    newZoneORC.forEach((item) => {
      if (item.show) drawBox(this.ctx, item);
    })
  }

  changeZoneORCFieldName = (e, index) => {
    const { zoneORC } = this.state;
    const newZoneORC = [...zoneORC];

    newZoneORC[index].field_name = e.target.value;
    this.setState({zoneORC: newZoneORC});

    /* Redraw canvas */
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
    newZoneORC.forEach((item) => {
      if (item.show) drawBox(this.ctx, item);
    })
  }

  saveZoneORCItem = (index) => {
    const { zoneORC } = this.state;
    const newZoneORC = [...zoneORC];

    newZoneORC[index].edit = false;
    this.setState({zoneORC: newZoneORC});

    /* Redraw canvas */
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
    newZoneORC.forEach((item) => {
      if (item.show) drawBox(this.ctx, item);
    })
  }

  removeZoneORCItem = (_id) => {
    const { zoneORC } = this.state;
    let newZoneORC = [...zoneORC];
    newZoneORC = newZoneORC.filter((item) => item._id !== _id);
    this.setState({zoneORC: newZoneORC})

    /* Redraw canvas */
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
    newZoneORC.forEach((item) => {
      if (item.show) drawBox(this.ctx, item);
    })
  }

  /* Pupup function add data to filters */
  closePopup = () => {
    const popup = {left: 0, top: 0, show: false, dataFieldName: ''};
    this.setState({popup});

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);

    // Redraw exists rectangle
    const { zoneORC } = this.state;
    zoneORC.forEach((item) => {
      if (item.show) drawBox(this.ctx, item);
    })
  }
 
  onChangeDataFieldName = (e) => {
    const { popup } = this.state;
    this.setState({popup: {...popup, dataFieldName: e.target.value}})
  }

  addDataFieldZoneORC = (e) => {
    if (e.key === 'Enter') {
      // Add data field name to zoneORCItem object
      const { popup, zoneORC } = this.state;
      this.zoneORCItem.field_name = popup.dataFieldName;

      // Set new zoneORC, hidden and reset data popup
      const newZoneORC = [...zoneORC, this.zoneORCItem];
      this.setState({
        zoneORC: newZoneORC,
        popup: {left: 0, top: 0, show: false, dataFieldName: ''}
      })

      /* Redraw canvas */
      newZoneORC.forEach((item) => {
        if (item.show) drawBox(this.ctx, item);
      })
    }
  }

  /* Choose Key Filter function */
  triggerShowModalChooseFilterKeyFilter = () => {
    const modal = { chooseKeyFilter: true, review: false };
    this.setState({modal});
  }

  afterCloseModal = () => {
    const modal = { chooseKeyFilter: false, review: false };
    this.setState({modal});
  }

  addDataFieldKeyFilter = (
    name, type_start, value_start, type_end, value_end,
    case_sensitive_end, beginning_of_line_end, case_sensitive_start, beginning_of_line_start
  ) => {
    if (name) {
      const { keyFilter } = this.state;
      const newKeyFilter = [...keyFilter, {
        field_name: name,
        type_start,
        value_start,
        type_end: value_end ? (type_end ? type_end : 3) : '',
        value_end,
        case_sensitive_end,
        beginning_of_line_end,
        case_sensitive_start,
        beginning_of_line_start
      }];
      this.setState({modal: { chooseKeyFilter: false, review: false }, keyFilter: newKeyFilter});
    }
  }

  /* Rule function */
  closeViewResult = () => {
    const modal = { chooseKeyFilter: false, review: false };
    this.setState({ reviewResult: null, modal });
  }

  getReviewResult = () => {
    this.setState({loading: true});
    const { name, engine_type, base64, zoneORC, keyFilter } = this.state;
    
    const rule = {
      name,
      engine_type,
      image: base64,
      filters: []
    };

    if (zoneORC.length) {
      rule.filters.push({
        type: 0,
        data: transformCoordinatesCanvasToCoordinatesImage([...zoneORC], this.canvas.width, this.canvas.height, this.image.width, this.image.height)
      })
    }

    if (keyFilter.length) {
      rule.filters.push({ type: 1, data: keyFilter });
    }

    console.log(rule)

    rules.review(rule).then((data) => {
      const modal = { chooseKeyFilter: false, review: true };
      this.setState({ loading: false, reviewResult: data, modal });
    })
  }

  saveRule = () => {
    this.setState({loading: true});
    const { name, engine_type, base64, zoneORC, keyFilter, table } = this.state;
    
    const rule = {
      name,
      engine_type,
      image: base64,
      filters: []
    };

    if (zoneORC.length) {
      rule.filters.push({
        type: 0,
        data: transformCoordinatesCanvasToCoordinatesImage(zoneORC, this.canvas.width, this.canvas.height, this.image.width, this.image.height) 
      })
    }

    if (keyFilter.length) {
      rule.filters.push({ type: 1, data: keyFilter })
    }
    
    if (table.length) {
      rule.filters.push({ type: 2, data: table })
    }
    
    rules.create(rule).then((data) => {
      this.props.add_rule(data);
      this.props.history.push('/')
    })
  }

  render() {
    const { name, base64, popup, modal, zoneORC, keyFilter, loading, reviewResult } = this.state;

    return (
      <Fragment>
        <section className="create-rule-page">
          <div className="header">
            <Link to="/"><img className="header__icon" src="/icon/back-arrow.svg" alt="back"/></Link>
            <div className="header__name">{name}</div>
            <div className="header__btn">
              <div className="save--btn" onClick={this.getReviewResult}>Review</div>
              <div className="save--btn" onClick={this.saveRule}>Save</div>
            </div>
          </div>
          <div className="tools">
            <img src="/icon/rectangle.svg" alt="rect" title="Box" onClick={this.triggerBoxingFunction} />
            <img src="/icon/font.svg" alt="font" title="Key Value" onClick={this.triggerShowModalChooseFilterKeyFilter} />
          </div>
          <div className="body">
            <div className="body__image-box">
              <canvas width="700" id="canvas"></canvas>
            </div>

            <div className="body__data-fields data-fields">
              <div className="data-fields__header">
                Data Fields
              </div>
              <div className="data-fields__body">
                <ZoneORCList
                  data={zoneORC}
                  changeZoneORCFieldName={this.changeZoneORCFieldName}
                  toggleZoneORCItem={this.toggleZoneORCItem}
                  saveZoneORCItem={this.saveZoneORCItem}
                  editZoneORCItem={this.editZoneORCItem}
                  removeZoneORCItem={this.removeZoneORCItem}
                />
                {
                  keyFilter.map((keyFilterItem) => (
                    <div className="data-fields__item keyvalue" key={keyFilterItem.field_name}>
                      <div className="data-fields__item--name">
                        <div className="name text-truncate">{keyFilterItem.field_name}</div>
                        {/* <div className="type">{keyFilterItem.type}</div>
                        <div className="start">START - {keyFilterItem.value[0]}</div>
                        <div className="stop">STOP - {keyFilterItem.value[1]}</div> */}
                      </div>
                      <div className="data-fields__item--tools">
                        <Icon name="edit" />
                        <Icon name="trash" />
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </section>
        <PopupAddName
          {...popup}
          onChangeDataFieldName={this.onChangeDataFieldName}
          addDataFieldZoneORC={this.addDataFieldZoneORC}
          closePopup={this.closePopup}
        />
        <Modal
          show={modal.chooseKeyFilter}
          afterCloseModal={this.afterCloseModal}
        >
          <ModalChooseKeyValueFilter image={base64} addDataFieldKeyFilter={this.addDataFieldKeyFilter} />
        </Modal>
        <Modal
          show={modal.review}
          afterCloseModal={this.closeViewResult}
        >
          <ResultView document={reviewResult} closeViewResult={this.closeViewResult} />
        </Modal>
        {
          loading ? <Overlay /> : ''
        }
      </Fragment>
    )
  }
}

export default connect(null, { add_rule })(withRouter(Create));
