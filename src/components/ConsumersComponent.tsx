/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import { StreamInfo } from "nats.ws";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { listConsumers } from "../store/streams";

type props = {
  jetstream: StreamInfo;
};

const ConsumersComponent = ({ jetstream }: props) => {
  const dispatch = useAppDispatch();
  const { jetstreamManager, consumers } = useAppSelector(
    (state) => state.streams
  );
  const config = { stream: jetstream, jetstreamManager: jetstreamManager };
  const [consumersList, setConsumersList] = useState<JSX.Element[]>([]);
  dispatch(listConsumers(config));
  let counter = 0;
  useEffect(() => {
    consumers.map((c) => {
      setConsumersList([
        ...consumersList,
        <p key={counter}>{c.config.name}</p>,
      ]);
      counter++;
    });
  }, [consumers]);
  console.log(consumersList);
  // const consumersList = [];
  // let counter = 0;
  // consumers?.map((c) => {
  //   consumersList.push(<span key={counter}>c.name</span>);
  //   counter++;
  // });

  return (
    <>
      <div>{consumersList}</div>
    </>
  );
};

export default ConsumersComponent;
