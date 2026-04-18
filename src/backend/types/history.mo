import Common "common";

module {
  public type Mode = { #Text; #Image; #Video; #Music; #Analytics };
  public type ReasoningStyle = { #Creative; #Analytical; #Technical };

  public type HistoryEntry = {
    id : Common.EntryId;
    prompt : Text;
    mode : Mode;
    reasoningStyle : ReasoningStyle;
    response : Text;
    timestamp : Common.Timestamp;
  };
};
