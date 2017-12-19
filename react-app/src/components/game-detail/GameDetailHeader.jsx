import React from 'react';
import {Row, Col} from 'react-bootstrap'
import Stopwatch from "../stopwatch/Stopwatch";

const GameDetailHeader = (props) => {
    const {homeTeamName, hostTeamName, gameElapsedSeconds, onGameIntervalTick} = props;

    return (
        <Row>
            <Col xs={12} className="game-detail__header">
                <Row className="game-stage">
                    1. poločas
                </Row>
                <Row className="timer">
                    <Stopwatch gameElapsedSeconds={gameElapsedSeconds} onGameIntervalTick={onGameIntervalTick} startDatetime="2017-12-18 21:00" />
                </Row>
                <Row className="score-board">
                    <Col xs={4} className="score-board__team score-board__team--home">
                        <div className="score-board__team-name">{homeTeamName}</div>
                        <div className="score-board__local">Domácí</div>
                    </Col>
                    <Col xs={4} className="score-board__results">
                        2:1
                    </Col>
                    <Col xs={4} className="score-board__team score-board__team--visitors">
                        <div className="score-board__team-name">{hostTeamName}</div>
                        <div className="score-board__local">Hosté</div>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default GameDetailHeader;