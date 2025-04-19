"use client";
import React, { Component } from "react";
import eventEmitter from "@/utils/eventEmitter";
interface MatchData {
  matchId: string;
  matchOddsback: number;
  matchOddslay: number;
  matchOddsTeam: string;
  matchRuns: string;
  matchOvers: string;
  matchWikets: string;
  matchStatus: string;
  matchBattingTeam: string;
  matchcrr: string;
  aa: string;
  // matchlivedata:any;
}

function updateStatusNoteDirect(matchInfo: any) {
  if (!matchInfo?.status_note) return;
  
  return matchInfo.status_note = matchInfo.status_note
    .replace(/^Stumps : /, '')
    .replace(new RegExp(matchInfo.teama.name, 'gi'), matchInfo.teama.short_name)
    .replace(new RegExp(matchInfo.teamb.name, 'gi'), matchInfo.teamb.short_name);
}

class MatchWebSocket extends Component<object, MatchData> { // Changed from {} to object
  private socket: WebSocket | null = null;

  constructor(props: object) { // Changed from {} to object
    super(props);
    this.state = {
      matchId: "",
      matchOddsback: 0,
      matchOddslay: 0,   
      matchOddsTeam: "",   
      matchRuns: "",
      matchOvers: "",
      matchWikets: "", 
      matchStatus: "",
      matchBattingTeam: "",
      matchcrr: "",
      aa: "",
      // matchlivedata:""
    };
  }

  componentDidMount() {
    // Open WebSocket connection
    this.socket = new WebSocket(
      "ws://webhook.entitysport.com:8087/connect?token=7b58d13da34a07b0a047e129874fdbf4"
    );

    this.socket.onmessage = (event) => {
      // console.log("wesocket",event.data);
      eventEmitter.emit("matchEvent", event.data);
      
      const data = JSON.parse(event.data).response;
      if(data?.ball_event !== undefined && data?.ball_event !== null && data?.ball_event !== '' && data?.ball_event !== Number){
        const ballelements = document.querySelectorAll(
          `.ballEvent${data.match_id}`
        ); 
        ballelements.forEach((element) => {
          element.innerHTML =   data?.ball_event;
        });

        eventEmitter.emit("ballEvent", {
          matchId: data.match_id,
          ballEvent: data.ball_event
        });
        // console.log(data.match_id+" live "+data?.ball_event +" id "+ data.match_id);
      //   const utterance = new SpeechSynthesisUtterance(data?.ball_event);
      // utterance.lang = "hi-IN";
      // window.speechSynthesis.speak(utterance);
      
      }
      if (
        data?.match_id !== undefined &&
        data?.match_id !== "" &&
        data?.live?.live_inning?.batting_team_id !== undefined &&
        data?.live?.live_inning?.batting_team_id !== ""
      ) {
        const match_status_note = updateStatusNoteDirect(data?.match_info);
        
        const a = parseFloat(data?.live_odds?.matchodds?.teama?.back);
        const b = parseFloat(data?.live_odds?.matchodds?.teamb?.back);
        const lesserTeam = a < b 
          ? { matchId: data?.match_id,team: data?.match_info?.teama?.short_name, ...data?.live_odds?.matchodds?.teama } 
          : { matchId: data?.match_id,team: data?.match_info?.teamb?.short_name, ...data?.live_odds?.matchodds?.teamb };

          eventEmitter.emit("oddsEvent", {
            matchId: data.match_id,
            oddsEvent: lesserTeam
          });

        this.setState({
          matchId: data?.match_id,
          // matchOddsback: data?.live_odds?.matchodds?.teama.back
          //   ? data.live_odds.matchodds.teama.back
          //   : 0,
          // matchOddslay: data?.live_odds?.matchodds?.teama.lay
          //   ? data.live_odds.matchodds.teama.lay
          //   : 0,
            matchOddsback: lesserTeam?.back
            ? lesserTeam?.back
            : 0,
          matchOddslay: lesserTeam?.lay
            ? lesserTeam?.lay
            : 0,
          matchOddsTeam: lesserTeam?.team,
          matchBattingTeam: data?.live?.live_inning?.batting_team_id,
          matchRuns: data?.live?.live_score?.runs,
          matchOvers: data?.live?.live_score?.overs,
          matchWikets: data?.live?.live_score?.wickets,
          matchStatus: JSON.stringify(match_status_note),
          matchcrr: data?.live?.live_score?.runrate,
          // matchlivedata: data,
        });

        eventEmitter.emit("matchLiveData", data);
        // Update div elements based on class
        this.updateDivElements();
      }
    };

    this.socket.onopen = () => console.log("✅ WebSocket Connected");
    this.socket.onclose = () => console.log("❌ WebSocket Disconnected");
  }

  componentWillUnmount() {
    // Close WebSocket when the component unmounts
    if (this.socket) {
      this.socket.close();
    }
  }

  // Function to update all div elements with a specific class
  updateDivElements = () => {
    const elements = document.querySelectorAll(
      `.match${this.state.matchId}-${this.state.matchBattingTeam}`
    ); // Select elements with class `match-info`
    elements.forEach((element) => {
      element.innerHTML = `
              <span className="font-semibold text-[15px] text-[#black]" style="font-weight: 600; font-size: 15px;">${this.state.matchRuns}/${this.state.matchWikets}</span>
              <span className="text-[12px] text-[black]" style="font-size: 12px;">
                ${this.state.matchOvers}
              </span>
              <Image  loading="lazy"  src="/assets/img/home/bat.png" style="height:12px; margin-bottom: 3px;" className="h-[12px] mb-[3px]" alt="" />
      `;
    });

    // for mobile view
    const melements = document.querySelectorAll(
      `.mmatch${this.state.matchId}-${this.state.matchBattingTeam}`
    ); 
    melements.forEach((element) => {
      element.innerHTML = `
              <span className="font-semibold" style="font-weight: 600;">${this.state.matchRuns}/${this.state.matchWikets} </span>
              <span className="text-[#909090] text-[12px] font-normal">(${this.state.matchOvers})</span>
      `;
    });

    const batImages = document.querySelectorAll(`.mmatchbat${this.state.matchId}-${this.state.matchBattingTeam}`);
    batImages.forEach((el) => el.classList.remove("hidden"));
  

    const statuselements = document.querySelectorAll(
      `.statusNote${this.state.matchId}`
    ); // Select elements with class `match-info`

    statuselements.forEach((element) => {
      element.innerHTML = ` <p>${JSON.parse(this.state.matchStatus)}</p>`;
    });

    const oddbackelements = document.querySelectorAll(
      `.oddback${this.state.matchId}`
    ); // Select elements with class `match-info`

    oddbackelements.forEach((element) => {
      element.innerHTML = ` <p>${this.state.matchOddsback > 0 ? Math.round((this.state.matchOddsback)*100-100) : 0}</p>`;
    });

    const oddlayelements = document.querySelectorAll(
      `.oddlay${this.state.matchId}`
    ); // Select elements with class `match-info`

    oddlayelements.forEach((element) => {
      element.innerHTML = ` <p>${this.state.matchOddslay > 0 ? Math.round((this.state.matchOddslay)*100-100) : 0}</p>`;
    });

    const oddteamelements = document.querySelectorAll(
      `.oddsTeam${this.state.matchId}`
    ); // Select elements with class `match-info`

    oddteamelements.forEach((element) => {
      element.innerHTML = ` <p>${this.state.matchOddsTeam}</p>`;
    });

    // more info page 
    // const matchInfoelements = document.querySelectorAll(
    //   `.matchinfo${this.state.matchId}-${this.state.matchBattingTeam}`
    // ); // Select elements with class `match-info`
    // matchInfoelements.forEach((element) => {
    //   element.innerHTML = `${this.state.matchRuns}/${this.state.matchWikets}
    //                     <span className="text-[13px] font-medium"  style="font-weight: 500; font-size: 13px">(${this.state.matchOvers})</span>
    //                   `;
    // });

    const crrelements = document.querySelectorAll(
      `.crr${this.state.matchId}`
    ); // Select elements with class `match-info`

    crrelements.forEach((element) => {
      element.innerHTML = ` <p>CRR: ${this.state.matchcrr } ${JSON.parse(this.state.matchStatus)}</p>`;
    });
  };

  render() {
    return <div></div>
  }
}

export default MatchWebSocket;
