import List "mo:core/List";
import Types "../types/history";
import Common "../types/common";
import Int "mo:core/Int";

module {
  public func save(
    entries : List.List<Types.HistoryEntry>,
    nextId : Nat,
    prompt : Text,
    mode : Types.Mode,
    reasoningStyle : Types.ReasoningStyle,
    response : Text,
    timestamp : Common.Timestamp,
  ) : Common.EntryId {
    let entry : Types.HistoryEntry = {
      id = nextId;
      prompt;
      mode;
      reasoningStyle;
      response;
      timestamp;
    };
    entries.add(entry);
    nextId;
  };

  public func list(entries : List.List<Types.HistoryEntry>) : [Types.HistoryEntry] {
    let arr = entries.toArray();
    arr.sort(func(a, b) = Int.compare(b.timestamp, a.timestamp));
  };

  public func delete(entries : List.List<Types.HistoryEntry>, id : Common.EntryId) : Bool {
    let sizeBefore = entries.size();
    let filtered = entries.filter(func(e : Types.HistoryEntry) : Bool { e.id != id });
    entries.clear();
    entries.append(filtered);
    entries.size() < sizeBefore;
  };

  public func clear(entries : List.List<Types.HistoryEntry>) {
    entries.clear();
  };
};
