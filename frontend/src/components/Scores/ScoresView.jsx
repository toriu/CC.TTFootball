import React from 'react';
import Scores from './Scores';
import _ from 'lodash';
import { Form, Segment, Label, Header, Icon, Table } from 'semantic-ui-react';

class ScoresView extends Scores {
  constructor(props) {
    super(props);

    this.state = {
      column: null,
      direction: null,
      league: '',
      data: [],
    };

    this.league = [];
    this.leagueAll = [];
    this.gl('forSelect');
    this.gl('all');
  }

  handleSort = clickedColumn => () => {
    const { column, data, direction } = this.state;

    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        data: _.sortBy(data, [clickedColumn]),
        direction: 'ascending',
      });
      return;
    }

    this.setState({
      data: data.reverse(),
      direction: direction === 'ascending' ? 'descending' : 'ascending',
    });
  };

  onSelectChange = (e, { value }) => {
    const index = this.league.map(el => el.value).indexOf(value);
    const id = this.league[index].key;
    const leagueAllIndex = this.leagueAll.map(el => el._id).indexOf(id);

    const teams = this.leagueAll[leagueAllIndex].teams;
    this.prepareState(teams);
    if (teams.length > 0) {
      this.setState(() => {
        return {
          league: value,
          data: this.state.data,
        };
      });
    } else {
      this.setState(() => {
        return {
          league: value,
          data: [
            {
              team: 'Brak drużyn w lidze',
              points: 0,
              matchesPlayed: 0,
              matchesWon: 0,
              matchesLost: 0,
              matchesTies: 0,
              goalsFor: 0,
              goalsAgainst: 0,
              balance: 0,
            },
          ],
        };
      });
    }
  };

  prepareState = teams => {
    for (let i = 0; i < teams.length; i++) {
      const stats = teams[i].statistics;
      const team = teams[i].team;
      if (i === 0) {
        this.state.data = [this.newStateData(team, stats)];
      } else {
        this.state.data = [...this.state.data, this.newStateData(team, stats)];
      }
    }
    this.state.data.sort((a, b) => b.points - a.points || b.balance - a.balance)
                    .forEach((e, index, arr) => arr[index].position= index + 1)
  };

  newStateData = (team, stats) => {
    return {
      team: {
        name: team.name,
        players: `${team.players.first}/${team.players.second}`
      },
      points: stats.matches.won * 3 + stats.matches.ties * 1,
      matchesPlayed: stats.matches.won + stats.matches.lost + stats.matches.ties,
      matchesWon: stats.matches.won,
      matchesLost: stats.matches.lost,
      matchesTies: stats.matches.ties,
      goalsFor: stats.goals.for,
      goalsAgainst: stats.goals.against,
      balance: stats.goals.for - stats.goals.against,
      position: '',
    };
  };

  onFormSubmit = e => {
    e.preventDefault();
  };

  render() {
    const { column, data, direction } = this.state;

    return (
      <div className="container" style={{ textAlign: 'left' }}>
        <Header as="h2" textAlign="center" style={{ paddingLeft: '40px' }}>
          <Icon name="ordered list" />
          <Header.Content>Przejrzyj wyniki</Header.Content>
        </Header>

        <Segment>
          <Form onSubmit={this.onFormSubmit}></Form>
          <Form.Group>
            <Form.Field>
              <Label>Lista lig</Label>
              <Form.Dropdown
                key="leagueSelect"
                name="leagueSelect"
                selection
                value={this.state.league}
                options={this.league}
                onChange={(e, v) => this.onSelectChange(e, v)}
              />
            </Form.Field>
          </Form.Group>
        </Segment>
        { this.state.data[0] && this.state.data[0].team ==='Brak drużyn w lidze' && (
          <>
          <br/>
          <div>
            <h3> Wygląda na to, że nikt się tu jeszcze nie zapisał.</h3>
          </div>
          </>
        )}
        { this.state.data[0] && this.state.data[0].team !=='Brak drużyn w lidze' && (
          <Table sortable celled fixed>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell sorted={column === 'position' ? direction : null} onClick={this.handleSort('position')}>
                Pozycja
              </Table.HeaderCell>
              <Table.HeaderCell sorted={column === 'team' ? direction : null} onClick={this.handleSort('team')}>
                Drużyna
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'matchesPlayed' ? direction : null}
                onClick={this.handleSort('matchesPlayed')}
              >
                Rozegrane <br/> mecze
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'matchesWon' ? direction : null}
                onClick={this.handleSort('matchesWon')}
              >
                Wygrane
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'matchesLost' ? direction : null}
                onClick={this.handleSort('matchesLost')}
              >
                Przegrane
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'matchesTies' ? direction : null}
                onClick={this.handleSort('matchesTies')}
              >
                Remisy
              </Table.HeaderCell>
              <Table.HeaderCell sorted={column === 'goalsFor' ? direction : null} onClick={this.handleSort('goalsFor')}>
                Strzelone<br/> bramki
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'goalsAgainst' ? direction : null}
                onClick={this.handleSort('goalsAgainst')}
              >
                Stracone<br/> bramki
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'balance' ? direction : null}
                onClick={this.handleSort('balance')}
              >
                Bilans<br/> bramek
              </Table.HeaderCell>
              <Table.HeaderCell sorted={column === 'points' ? direction : null} onClick={this.handleSort('points')}>
                Punkty
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {_.map(data, ({ team, points, matchesPlayed, matchesWon, matchesLost, matchesTies, goalsFor, goalsAgainst, balance, position }) => (
              <Table.Row key={team.name}>
                <Table.Cell> {position} </Table.Cell>
                <Table.Cell> <b>{team.name}</b>  <br/> {team.players}</Table.Cell>
                <Table.Cell>{matchesPlayed}</Table.Cell>
                <Table.Cell>{matchesWon}</Table.Cell>
                <Table.Cell>{matchesLost}</Table.Cell>
                <Table.Cell>{matchesTies}</Table.Cell>
                <Table.Cell>{goalsFor}</Table.Cell>
                <Table.Cell>{goalsAgainst}</Table.Cell>
                <Table.Cell>{balance}</Table.Cell>
                <Table.Cell><b>{points}</b></Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        )}
        
      </div>
    );
  }
}

export default ScoresView;
