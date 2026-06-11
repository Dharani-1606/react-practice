import { useState } from "react";
import { Tab, TabPane } from "semantic-ui-react";

export const PopupContent = ({ feature }) => {
    const attrs = feature.graphic.attributes;
    const [activeIndex, setActiveIndex] = useState(0);

    const panes = [
        {
            menuItem: "General",
            render: () => (
                <TabPane className="ui bottom attached active tab segment">
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset's Body Type sheets. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised thanks to these sheets and more recently with desktop publishing software including versions of Lorem Ipsum.</p>
                </TabPane>
            )
        },
        {
            menuItem: "Statistics",
            render: () => (
                <TabPane className="ui bottom attached active tab segment">
                    <p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.</p>
                    <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.</p>
                </TabPane>
            )
        },
        {
            menuItem: "Details",
            render: () => (
                <TabPane className="ui bottom attached active tab segment">
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eu massa nisl. Etiam a lorem non est pharetra commodo at eget magna. Donec eleifend viverra ex. Maecenas ut scelerisque augue. Pellentesque imperdiet pellentesque dictum. Proin mi odio, commodo sit amet purus ac, posuere tristique felis. Duis placerat aliquam tellus. Vivamus ut elit odio. Curabitur ut leo in metus interdum accumsan. Vestibulum convallis enim id metus varius auctor. Nunc augue leo, consequat sit amet fermentum aliquam, aliquet et libero. In quam velit, finibus quis purus at, elementum venenatis neque.</p>
                    <p>Sed mi nibh, commodo eget libero quis, consectetur iaculis nulla. Duis venenatis risus orci, id bibendum ipsum maximus vel. Nullam quis bibendum eros. Nunc commodo faucibus risus, in pretium dui gravida quis. Nulla bibendum urna in sem eleifend, et hendrerit ex lacinia. Praesent accumsan ex eget volutpat sagittis. Praesent convallis pulvinar nulla. Vivamus convallis ex vitae est vestibulum laoreet. Curabitur vel felis eu velit posuere vestibulum. Praesent nisi risus, vehicula in libero vel, dictum lacinia nisl. Etiam pretium, tellus id luctus pulvinar, mi magna euismod lacus, id fermentum lectus risus vel nisi. Quisque mattis dui at purus faucibus, id tristique augue luctus.</p>
                    <p>In tincidunt odio et ante tempus pharetra. Nulla sit amet justo quis dui viverra varius. Fusce vel mi eu erat pretium cursus. Etiam arcu eros, ornare et magna vel, placerat commodo ex. Fusce non egestas dolor. Pellentesque orci tellus, sodales vitae ultricies vulputate, ullamcorper a lacus. Donec nulla ipsum, fringilla vitae nunc ac, pulvinar facilisis quam. Curabitur volutpat velit vel magna viverra, quis convallis mauris dignissim. Donec placerat lacinia metus vitae vestibulum. Maecenas dictum eleifend enim, sed sollicitudin enim ultricies ut. Morbi iaculis sed eros eu sodales. Duis sed diam metus.</p>
                </TabPane>
            )
        }
    ];


    console.log("log attrs :>>", feature);
    return (
        <div className="popup-wrapper">
            {/* <span>Active Index: {activeIndex}</span> */}
            <Tab
                menu={{ secondary: true, pointing: true }}
                panes={panes}
                activeIndex={activeIndex}
                onTabChange={(e, { activeIndex }) => {
                    setActiveIndex(activeIndex as number);
                }}
            />
        </div>
    );
};