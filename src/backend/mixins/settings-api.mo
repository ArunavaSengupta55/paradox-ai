import Map "mo:core/Map";
import Principal "mo:core/Principal";
import SettingsTypes "../types/settings";
import SettingsLib "../lib/settings";

mixin (settingsStore : Map.Map<Principal, SettingsTypes.UserSettings>) {
  public shared ({ caller }) func saveSettings(settings : SettingsTypes.UserSettings) : async () {
    SettingsLib.save(settingsStore, caller, settings);
  };

  public shared query ({ caller }) func getSettings() : async ?SettingsTypes.UserSettings {
    SettingsLib.get(settingsStore, caller);
  };
};
