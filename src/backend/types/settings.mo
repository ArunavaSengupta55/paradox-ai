import History "history";

module {
  public type Theme = { #Dark; #Light };

  public type UserSettings = {
    defaultMode : History.Mode;
    defaultReasoningStyle : History.ReasoningStyle;
    theme : Theme;
  };
};
