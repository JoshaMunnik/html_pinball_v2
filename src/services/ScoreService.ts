import {UFFetchMethod} from "@ultraforce/ts-dom-lib/dist/types/UFFetchMethod";

type ScoringResponse = {
  success: boolean;
  highscore?: number;
  message?: string;
}

export class ScoreService {
  private m_score: number = 0;

  async loadHighscore(): Promise<number> {
    return this.m_score;
    /*
    const response: Response = await window.fetch('scoring.php');
    return await this.processResponse(response);
    */
  }

  async saveScore(aScore: number): Promise<number> {
    this.m_score = Math.max(aScore, this.m_score);
    return this.m_score;
    /*
    const data: FormData = new FormData();
    data.append('score', aScore.toString());
    const hash: number =
      (Math.floor(Math.random() * 1000000000 + window.performance.now() + window.performance.timeOrigin) & 0xFFF00000FFF)
      | ((aScore & 0xFFFFF) << 12);
    data.append('hash', hash.toString());
    const response: Response = await window.fetch(
      'scoring.php',
      {
        method: UFFetchMethod.Post,
        body: data
      }
    );
    return await this.processResponse(response);
    */
  }

  private async processResponse(aResponse: Response): Promise<number> {
    const data: ScoringResponse = await aResponse.json() as ScoringResponse;
    if (data.success) {
      return data.highscore;
    }
    console.error('Error loading highscore: ' + data.message);
    return 0;
  }
}