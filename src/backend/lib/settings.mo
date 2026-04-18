import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Types "../types/settings";

module {
  public func save(
    store : Map.Map<Principal, Types.UserSettings>,
    caller : Principal,
    settings : Types.UserSettings,
  ) {
    store.add(caller, settings);
  };

  public func get(
    store : Map.Map<Principal, Types.UserSettings>,
    caller : Principal,
  ) : ?Types.UserSettings {
    store.get(caller);
  };
};
