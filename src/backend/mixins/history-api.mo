import List "mo:core/List";
import Time "mo:core/Time";
import HistoryTypes "../types/history";
import Common "../types/common";
import HistoryLib "../lib/history";

mixin (entries : List.List<HistoryTypes.HistoryEntry>) {
  var nextEntryId : Nat = 0;

  public shared func saveHistoryEntry(
    prompt : Text,
    mode : HistoryTypes.Mode,
    reasoningStyle : HistoryTypes.ReasoningStyle,
    response : Text,
  ) : async Common.EntryId {
    let id = HistoryLib.save(entries, nextEntryId, prompt, mode, reasoningStyle, response, Time.now());
    nextEntryId += 1;
    id;
  };

  public query func getHistory() : async [HistoryTypes.HistoryEntry] {
    HistoryLib.list(entries);
  };

  public shared func deleteHistoryEntry(id : Common.EntryId) : async Bool {
    HistoryLib.delete(entries, id);
  };

  public shared func clearHistory() : async () {
    HistoryLib.clear(entries);
  };
};
