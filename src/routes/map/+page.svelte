<script lang='ts'>
	import LocationCard from '$lib/components/location/LocationCard.svelte';
    import MapComponent from './local/Map.svelte'
    import MapPanel from './local/MapPanel.svelte';
    import PanelCard from '$lib/components/elements/PanelCard.svelte';
    import TrailList from './local/TrailList.svelte';
    import LocationList from './local/LocationList.svelte';
    import TrailInfo from './local/TrailInfo.svelte';
    import { onDestroy, onMount } from 'svelte';
    import { Map, Tutorial, type MapDataResponse } from './local/mapNodes';
    import { mapData } from '../store';

    let options = {}
    let interactable = false;

    onMount(() => {
        
        console.log(mapData)
        interactable = true
        options = {
            "Tutorials": {
                obj: LocationList,
                data: $mapData.nodes
            },
            "Maps": {
                obj: TrailList,
                data: $mapData.projects
            }
        }
        // setInterval(() => {$mapData.nodes[0].completed = !$mapData.nodes[0].completed}, 1000)
    })

    onDestroy(() => {
        interactable = false
    })

    let selectedNode:string|null
    let map:any

    function closeLocationPanel() {
        if(selectedNode) {
            $mapData.nodeObj[selectedNode].selected = false
            selectedNode = null
            map.focus()
        }
    }
    let openPanel:string|null = null
    function selectFromMap(e:any) {
        console.log("Select from map...")
        if(e.detail.data.selected) {
            selectedNode = e.detail.data.id
        } else {
            closeLocationPanel();
        }
    }

    
    function handleCapture(e:any) {
        interactable = e.detail
    }

    function closePanel() {
        openPanel = null
    }

    function handlePanelSelect(e:any) {
        console.log(e.detail.type)
        if(e.detail.type == 'location') {
            selectLocation(e)
        } else if(e.detail.type == 'trail') {
            selectTrail(e)
        }
    }
    function selectLocation(e:any) {
        selectedNode = e.detail.data.id
        $mapData.nodeObj[selectedNode].selected = true
        // zoom into node
        map.focus(e.detail.data)
    }
    function selectTrail(e:any) {
        e.detail.data.highlight()
    }
</script>
<section class='map hero is-fullheight-with-navbar'>
    <div  class='ui'>
        <MapPanel  bind:selected={openPanel} />
        
        <div class='panels'>
            <PanelCard on:capture={handleCapture} title={openPanel} loaded={openPanel? true:false} on:close={closePanel}>
                <svelte:component
                    this={options[openPanel].obj}
                    on:select={handlePanelSelect}
                    bind:selectedNode={$mapData.nodeObj[selectedNode]}
                />
            </PanelCard>
            
            <PanelCard on:capture={handleCapture}
                title={selectedNode? $mapData.nodeObj[selectedNode].frontmatter.title:'no title'} 
                titleSize={'large'} 
                loaded={selectedNode? $mapData.nodeObj[selectedNode].selected : false} 
                on:close={closeLocationPanel}
            >
                <LocationCard node={selectedNode} />
            </PanelCard>
        </div>
    </div>
    <div class='hero-body m-0 p-0'>
        <MapComponent
            bind:this={map}    
            on:nodeSelect={selectFromMap} 
            data={$mapData}
            center={openPanel? 0.75 : 0.5}
            interact={interactable} 
        />
    </div>
</section>

<style>
    .map {
        overflow: hidden;
        padding-top: 0;
    }
    .ui {
        position: absolute;
        height: 100%;
        width: 100%;
        /* background-color: blue; */
    }
    .panels {
        position: absolute;
        display: inline-block;
        /* width: 100%; */
    }
</style>