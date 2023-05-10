import React, {useState} from "react";
import Tabs from "./Tabs";
import Tab from "./Tab";
import FactChainContributions from "../FactChainContributions";
import FactListContributions from "../FactListContributions";
import ChainListContributions from "../ChainListContributions";
import {Chain} from "../../types/Chain";

import { bus } from "../../utils/bus";
import { selectMapEvent } from "~/events/map/SelectMapEvent";
import BatfNoMarkerSelected from "./BatfNoMarkerSelected";
import { bool } from "aws-sdk/clients/signer";
import FactList from "../FactList";
import { Fact } from "@prisma/client";

interface BaftTabContainerProps{
    onMinimizeClick?: () => void;
    onFullScreenClick?: () => void;
    selectedTab?: number;
}

interface BatfTabContainerState{
    selectedTab: number;
    markerSelected: bool;
    facts: Fact[];
}

export default class TabContainer extends React.Component<BaftTabContainerProps, BatfTabContainerState> {
    markerSelected: boolean;

    constructor(props: BaftTabContainerProps) {
        super(props);
        this.state = {
            selectedTab: 0,
            markerSelected: false,
            facts : []
        };
        this.onMapChange();
    }
    onMapChange = () => {
        bus.subscribe(selectMapEvent, async event => {
            const geoInfos = event.payload;

           // console.log(event.payload.toString());
            this.setState({
                markerSelected: true
            });

            console.log(this.state.markerSelected);
            //console.log(geoInfos);
            let response = await fetch(`/api/facts?locationId=${geoInfos.properties.id}`)
            response = await response.json();
            console.log(response);
            this.setState({
                facts: response[0].facts});
            /*if (response != undefined){
                console.log("ici");
                console.log(response);

                console.log()
                this.setState({
                    facts: response[0].facts,
                    markerSelected: true
                });
            }*/
        });
    }
    selectedComponent(component: string){
        const facts = [  
            {    
              id: "1",    
              createdAt: "2023-05-05T10:30:00.000Z",    
              updatedAt: "2023-05-05T14:45:00.000Z",    
              title: "La première voiture produite en série est la Ford T",    
              shortDesc: "La Ford T, produite entre 1908 et 1927, est la première voiture produite en série.",    
              content: "La Ford T, produite entre 1908 et 1927, est considérée comme la première voiture produite en série. Elle était facile à produire et à réparer, et était disponible à un prix abordable pour les consommateurs moyens. Les ventes de la Ford T ont révolutionné l'industrie automobile et ont contribué à l'essor de l'économie américaine.",    
              from: "1908-01-01",    
              until: "1927-05-26",    
              bannerImg: "https://migrationphoto.files.wordpress.com/2015/10/fallwayland20101.jpg",    
              verified: true,    
              video: ["https://example.com/ford-t.mp4", "https://example.com/ford-t.webm"],
              audio: ["https://example.com/ford-t.mp3"],
              author: {
                id: "1",
                name: "Henry Ford"
              },
              tags: [
                {
                  id: "1",
                  name: "Histoire de l'automobile"
                },
                {
                  id: "2",
                  name: "Innovation"
                }
              ],
              locations: [
                {
                  id: "1",
                  name: "Michigan"
                },
                {
                  id: "2",
                  name: "États-Unis"
                }
              ],
              personsInvolved: [
                {
                  id: "1",
                  name: "Henry Ford"
                }
              ]
            },
            {
              id: "2",
              createdAt: "2023-05-04T09:15:00.000Z",
              updatedAt: "2023-05-05T16:30:00.000Z",
              title: "Le Titanic a coulé en 1912",
              content: "Le Titanic était un navire de croisière de luxe qui a coulé dans l'océan Atlantique en 1912, après avoir heurté un iceberg. Plus de 1500 personnes ont perdu la vie dans l'accident. Le naufrage du Titanic est considéré comme l'un des plus grands désastres maritimes de tous les temps et a conduit à des améliorations dans la sécurité maritime.",
              from : "1912-04-10",
              until: "1912-04-15",
              bannerImg: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/RMS_Titanic_3.jpg/1200px-RMS_Titanic_3.jpg",
              verified: true,
              video: ["https://example.com/titanic.mp4"],
              author: {
                id: "2",
                name: "William Thomas Stead"
              },
              tags: [
                {
                  id: "3",
                  name: "Histoire"
                },
                {
                  id: "4",
                  name: "Transport maritime"
                }
              ],
              locations: [
                {
                  id: "3",
                  name: "Atlantique Nord"
                }
              ],
              personsInvolved: [
                {
                  id: "2",
                  name: "Edward Smith"
                },
                {
                  id: "3",
                  name: "Bruce Ismay"
                }
              ]
            },
            {
              id: "3",
              createdAt: "2023-05-04T12:34:56.789Z",
              updatedAt: "2023-05-04T12:34:56.789Z",
              title: "La première voiture autonome a été testée avec succès",
              shortDesc: "Une équipe de chercheurs a réussi à tester avec succès la première voiture autonome équipée de technologies de pointe.",
              content: "L'équipe de chercheurs a travaillé pendant plusieurs années pour concevoir une voiture autonome capable de circuler sans l'intervention d'un conducteur humain. Après des tests intensifs sur route fermée, la voiture a réussi à parcourir plusieurs kilomètres sans rencontrer de problèmes majeurs. La technologie utilisée pour rendre la voiture autonome repose sur des capteurs sophistiqués, des caméras et des algorithmes avancés de traitement d'image. Cette prouesse technique ouvre la voie à un avenir où les voitures autonomes pourraient devenir la norme.",
              from : "2023-05-04",
              until: "2023-05-04",
              bannerImg: "https://tse3.mm.bing.net/th?id=OIP.p-aZsNRUiC7FilHb3hnEYgHaE8&pid=Api",
              verified: true,
              video: ["https://example.com/video.mp4"],
              audio: ["https://example.com/audio.mp3"],
              author: {
                id: "1",
                name: "John Doe"
              },
              tags: [
                {
                  id: "1",
                  name: "Voitures autonomes"
                },
                {
                  id: "2",
                  name: "Technologie"
                }
              ],
              locations: [
                {
                  id: "1",
                  name: "Silicon Valley"
                },
                {
                  id: "2",
                  name: "San Francisco"
                }
              ],
              personsInvolved: [
                {
                  id: "1",
                  name: "Alice Smith"
                },
                {
                  id: "2",
                  name: "Bob Johnson"
                }
              ]
            }
          ];
        /*if(!this.state.markerSelected){
            return <BatfNoMarkerSelected/>
        }
        else{*/
            switch (component) {
                case "Évenements":
                    return <FactList facts={this.state.facts}/>;
                
                case "Anecdotes":
                    return <></>;
                
                case "Chaines":
                    return <FactChainContributions facts={facts}/>;
            }
       // }
    }

    render() {
        return (
            <>
                <div className={`batf-toolbar`}>
                    <button className="toggle" onClick={this.props.onFullScreenClick}>
                        <i className="fa fa-expand" style={{color:'#F1B706'}}></i>
                    </button>
                    <button className="toggle" onClick={this.props.onMinimizeClick}>
                        <i className="fa fa-minus" style={{color:'#F1B706'}}></i>
                    </button>
                </div>
                <Tabs>
                    <Tab title="Événements">
                        {this.selectedComponent("Évenements")}
                    </Tab>
                    <Tab title="Anecdotes">
                        {this.selectedComponent("Anecdotes")}
                    </Tab>
                    <Tab title="Chaines">
                        {this.selectedComponent("Chaines")}
                    </Tab>
                </Tabs>
            </>
        );
    }
}