import React, { ChangeEvent, Component } from "react";
import { Pick } from "./pick";

type Page = "mainpage" | "pick" | "website error";

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

interface AppState {
  page: Page; 
  id: string;
  drafters: string[];
  drafter: string;
  options: string[];
  rounds: number;
  currDraft: CandyDraft;
}


export class App extends Component<{}, AppState> {

  constructor(props: any) {
    super(props);

    this.state = {
      page: "mainpage",
      id: "",
      drafters: [],
      drafter: "",
      options: [],
      rounds: 1,
      currDraft: {
        id: -1,
        rounds: -1,
        indexTracker: -1,
        roundTracker: -1,
        candyType: [],
        drafters: [], 
        currPick: [],
        checker: false,
        onTheBoard: []
      }
    };
  }

  render = (): JSX.Element => {
    if (this.state.page === "mainpage") {
      return (
        <div>
          <label htmlFor="drafter">Drafter:</label>
          <input type="text" value={this.state.drafter} onChange={this.handleDrafter} />
          <strong> (required for either option)</strong>
          <div>
            <h2>Join Existing Draft</h2>
            <div>
              <label htmlFor="draftID">Draft ID:</label>
              <input type="text" value={this.state.id} onChange={this.handleID} />
            </div>
            <p></p>
            <button onClick={this.handleJoin}>Join</button>
          </div>
          <div>
            <h2>Create New Draft</h2>
            <div>
            </div>
            <p></p>
            <div>
              <label htmlFor="rounds">Rounds:</label>
              <input type="number" size={5} min={1} max={10} value={this.state.rounds} onChange={this.changeRound}></input>
            </div>
            <table>
              <tbody>
                <tr>
                  <td>
                    <h4>Options (one per line)</h4>
                    <textarea rows={20} cols={25} onChange={this.handleoptions}></textarea>
                  </td>
                  <td>
                    <h4>Drafters (one per line, in order)</h4>
                    <textarea rows={20} cols={25} onChange={this.handleDrafters}></textarea>
                  </td>
                </tr>
              </tbody>
            </table>
            <button onClick={this.handleCreate}>Create</button>
          </div>
        </div>
      );
    } else if (this.state.page === "website error") {
      return (
        <div>
          <p>Error: no draft with ID {this.state.id}</p>
        </div>
      );
    } else {
      return <Pick initialState={this.state.currDraft} drafter={this.state.drafter} id={this.state.currDraft.id} />;
    }
  };

  handleCreate = (): void => {
    if (this.state.drafters.length === 0) {
      alert("Please enter your name.");
      return;
    }

    const { options, drafters, rounds } = this.state;

    if (options.length === 0 || drafters.length === 0 || rounds <= 0) {
      alert("Make sure options, drafters, and rounds are inputted");
      return;
    }

    if (rounds * drafters.length > options.length) {
      alert(
        "Invalid options number. Please ensure that the number of draft " +
        "options is equal to or greater than drafters multiplied by rounds."
      );
      return;
    }

    const url = "/api/mainpage";

    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        candyType: this.state.options,
        drafters: this.state.drafters,
        rounds: this.state.rounds
      }),
      headers: { "Content-Type": "application/json" }
    })
      .then((response) => response.json())
      .then((draft) => {
        this.setState({
          currDraft: draft,
          page: "pick"
        })
      })
      .catch((error) => console.error("Create draft failed: ", error));
  }


  // case changing round
  changeRound = (event: ChangeEvent<HTMLInputElement>): void => {
    this.setState({rounds: event.target.valueAsNumber})
  }
  // case chaning id
  handleID = (event: ChangeEvent<HTMLInputElement>): void => {
    this.setState({id: event.target.value})
  }
  // case for inpput options
  handleoptions = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    const input = event.target.value;
    const options: string[] = input.split("\n");
    this.setState({options: options})
  }
  // case for inputs by drafters 1
  handleDrafters = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    const input = event.target.value;
    const drafters: string[] = input.split("\n");
    this.setState({drafters: drafters})
  }
  //case for inputs by drafters 2
  handleDrafter = (event: ChangeEvent<HTMLInputElement>): void => {
    this.setState({drafter: event.target.value})
  }
  // case for join to start server
  handleJoin = (): void => {
    const url = "/api/get?id=" + this.state.id;
    fetch(url)
    .then(this.handleJoinResponse)
    .catch(this.handleServerError)
  }
  // case for reponse of join and checks to see if ID is correct
  handleJoinResponse = (res: Response) => {
    if (res.status === 200) {
      res.json().then(this.handleJoinJson).catch(this.handleServerError);
    } else {
      this.setState({
        page: "website error"
      })
      this.handleServerError(res);
    }
  }
  // case for json
  handleJoinJson = (draft: any) => {
    this.setState({
      page: "pick",
      currDraft: draft,
    })
  }
  // case for server errors
  handleServerError = (_: Response) => {
    console.error(`unknown error`);
  };
}