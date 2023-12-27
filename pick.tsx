import React, {Component} from "react";

type CandyDraft = {
  id: number;
  rounds: number;
  indexTracker: number;
  roundTracker: number;
  candyType: string[];
  drafters: string[];
  currPick: {pick: string, drafter: string}[];
  checker: boolean;
  onTheBoard: string[];
}

interface DraftProps {
    initialState: CandyDraft;
    drafter: string,
    id: number
}

interface DraftState {
    currDraft: CandyDraft;
    currDrafter: string;
    currId: number;
    currOption: string
}

export class Pick extends Component<DraftProps, DraftState> {
    constructor(props: any) {
        super(props);
        this.state = {
          currDraft: props.initialState,
          currDrafter: props.drafter,
          currId: props.id,
          currOption: props.initialState.onTheBoard[0]}
    }

    render = (): JSX.Element => {
      const { currDraft } = this.state;
      const draftersNotEqual =
        this.state.currDraft.drafters[currDraft.indexTracker] !==
        this.state.currDrafter;
      const draftersEqual =
        this.state.currDraft.drafters[currDraft.indexTracker] ===
        this.state.currDrafter;
      const listItems = currDraft.currPick.map((item, index) => (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{item.pick}</td>
          <td>{item.drafter}</td>
        </tr>
      ));

      let message = null;

      if (draftersNotEqual && !this.state.currDraft.checker) {
        const currDrafter = this.state.currDraft.drafters[
          this.state.currDraft.indexTracker
        ];
        message = (
          <div>
            <p>Waiting for {currDrafter} to pick.</p>
            <button onClick={this.handleRefresh}>Refresh</button>
          </div>
        );
      } else if (draftersEqual && !this.state.currDraft.checker) {
        const options = this.state.currDraft.onTheBoard;
        //const selectedOption = options[0];
        const noPicks = currDraft.currPick.length === 0 ? (
              <p>No picks made yet.</p>
        ) : null;
        message = (
          <div>
            <thead>{noPicks}</thead>
            <p>It's your pick!</p>
            <select onChange={this.handleShowOptions}>
              {options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <button onClick={this.handleSelection}>Draft</button>
          </div>
        );

      } else {
        message = <p>Draft is complete.</p>;
      }
      const tableHeaders = currDraft.currPick.length !== 0 ? (
        <tr>
          <th>Num</th>
          <th>Pick</th>
          <th>Drafter</th>
        </tr>
      ) : null;
      return (
        <div>
          <h1>Status of Draft "{this.state.currId}"</h1>
          <table>
            <thead>{tableHeaders}</thead>
            <tbody>{listItems}</tbody>
          </table>
          {message}
        </div>
      );
    };


  handleShowOptions = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    this.setState({currOption: event.target.value});
  }

  // case refreshing
  handleRefresh = () => {
    fetch("/api/get?id=" + this.state.currId, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(this.handleResponse).catch(this.handleServerError);
  }

  // case for reponse after options
  handleResponse = (res: Response) => {
    if (res.status === 200) {
      res.json().then((data) => {
        this.setState({currDraft: data, currOption: data.onTheBoard[0]});
      })
    } else {
      this.handleServerError(res);
    }
  }

  // case options for selecting different options
  handleSelection = (): void => {
    const requestBody = {id: this.state.currId, drafter: this.state.currDrafter,
                        option: this.state.currOption};
      fetch("/api/draft", {method: 'POST', headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    }).then(this.handleUpdate).catch(this.handleServerError);
  }

  // case update draft options
  handleUpdate = (res: Response): void => {
    if (res.status === 200) {
      res.json().then((data) => {
        this.setState({currDraft: data, currOption: data.onTheBoard[0]})
      });

    } else {
      this.handleServerError(res);
    }
  }

  // case server error
  handleServerError = (_: Response): void => {
    console.error("Current unknown error in the server");
  };
}
