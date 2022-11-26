export enum connectionStatuses {
  notConnected = "Not Connected",
  Connecting = "Connecting",
  Connected = "Connected",
  Failed = "Failed",
  Timeout = "Timeout",
}

export enum Messages {
  purge = "Stream Successfully Purged",
  edit = "Stream Successfully Updated",
  add = "Stream Successfully Created",
  delete = "Stream Successfully Removed",
}

export enum Tooltips {
  subject = "Streams consume messages from subjects, this is a comma separated list that can include wildcards.",
  storage = "Streams are stored on the server, this can be one of many backends and all are usable in clustering mode.",
  discard = "Once the Stream reach it's limits of size or messages the New policy will prevent further messages from being added while Old will delete old messages.",
  retention = "Messages are retained either based on limits like size and age (Limits), as long as there are Consumers (Interest) or until any worker processed them (Work Queue).",
  replicas = "When clustered, defines how many replicas of the data to store.",
  max_msgs = "Defines the amount of messages to keep in the store for this Stream, when exceeded oldest messages are removed, -1 for unlimited.",
  max_msgs_per_subject = "Defines the amount of messages to keep in the store for this Stream per unique subject, when exceeded oldest messages are removed, -1 for unlimited.",
  max_bytes = "Defines the combined size of all messages in a Stream, when exceeded messages are removed or new ones are rejected, -1 for unlimited.",
  max_age = "Defines the oldest messages that can be stored in the Stream, any messages older than this period will be removed, -1 for unlimited.",
  max_msg_size = "Defines the maximum size any single message may be to be accepted by the Stream.",
  duplicate_window = "Duplicate messages are identified by the Msg-Id headers and tracked within a window of this size.",
}
