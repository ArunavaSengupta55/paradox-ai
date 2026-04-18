import List "mo:core/List";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import HistoryTypes "types/history";
import SettingsTypes "types/settings";
import HistoryMixin "mixins/history-api";
import SettingsMixin "mixins/settings-api";

actor {
  let entries = List.empty<HistoryTypes.HistoryEntry>();
  let settingsStore = Map.empty<Principal, SettingsTypes.UserSettings>();

  include HistoryMixin(entries);
  include SettingsMixin(settingsStore);
};
