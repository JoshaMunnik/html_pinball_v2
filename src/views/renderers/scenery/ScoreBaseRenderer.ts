import {MainModel} from "../../../models/MainModel";
import {ToggleSprite} from "../components/ToggleSprite";
import {UFPropertyChangedCallback} from "@ultraforce/ts-general-lib";


export class ScoreBaseRenderer extends ToggleSprite {
  // region private variables

  private readonly m_mainData: MainModel;
  private readonly m_propertyName: string;
  private m_currentCount: number;
  private readonly m_changeListener: UFPropertyChangedCallback;
  private m_onCount: number = 0;
  private readonly m_frameCount: number;

  // endregion

  // region constructor

  protected constructor(
    mainData: MainModel,
    propertyName: string,
    bitmapOff: HTMLImageElement,
    bitmapOn: HTMLImageElement,
    x: number,
    y: number,
    width: number,
    height: number,
    frameCount: number
  ) {
    super(x, y, width, height, bitmapOn, bitmapOff, false);
    this.m_mainData = mainData;
    this.m_propertyName = propertyName;
    this.m_changeListener = () => this.handlePropertyChange();
    this.m_mainData.addPropertyChangeListener(this.m_propertyName, this.m_changeListener);
    this.m_currentCount = this.m_mainData.getPropertyValue<number>(this.m_propertyName);
    this.m_frameCount = frameCount;
  }

  // endregion

  // region public methods

  dispose() {
    super.dispose();
    this.m_mainData.removePropertyChangeListener(this.m_propertyName, this.m_changeListener);
  }

  override update(timestamp: DOMHighResTimeStamp, framesSinceLastUpdate: number) {
    super.update(timestamp, framesSinceLastUpdate);
    if (this.m_onCount > 0) {
      this.m_onCount--;
      this.setState(this.m_onCount > 0);
    }
  }

  // endregion

  // region private methods

  private handlePropertyChange() {
    const newCount: number = this.m_mainData.getPropertyValue<number>(this.m_propertyName);
    if (newCount !== this.m_currentCount) {
      this.m_currentCount = newCount;
      this.m_onCount = this.m_frameCount;
    }
  }

  // endregion
}