import React, { useMemo } from "react";
import { useTree } from "@headless-tree/react";
import { Segment, Button, Checkbox, Icon } from "semantic-ui-react";
import {
    syncDataLoaderFeature,
    checkboxesFeature,
} from "@headless-tree/core";

type TreeNode = {
    name: string;
    children?: string[];
};

export type DemoItem = {
  name: string;
  children?: string[];
};

export const data: Record<string, TreeNode> = {
  root: {
    name: "Root",
    children: ["fruit", "vegetables", "meals", "dessert", "drinks"],
  },
  fruit: {
    name: "Fruit",
    children: ["apple", "banana", "orange", "berries", "lemon"],
  },
  apple: { name: "Apple" },
  banana: { name: "Banana" },
  orange: { name: "Orange" },
  lemon: { name: "Lemon" },
  berries: { name: "Berries", children: ["red", "blue", "black"] },
  red: { name: "Red", children: ["strawberry", "raspberry"] },
  strawberry: { name: "Strawberry" },
  raspberry: { name: "Raspberry" },
  blue: { name: "Blue", children: ["blueberry"] },
  blueberry: { name: "Blueberry" },
  black: { name: "Black", children: ["blackberry"] },
  blackberry: { name: "Blackberry" },
  vegetables: {
    name: "Vegetables",
    children: ["tomato", "carrot", "cucumber", "potato"],
  },
  tomato: { name: "Tomato" },
  carrot: { name: "Carrot" },
  cucumber: { name: "Cucumber" },
  potato: { name: "Potato" },
  meals: {
    name: "Meals",
    children: ["america", "europe", "asia", "australia"],
  },
  america: { name: "America", children: ["burger", "hotdog", "pizza"] },
  burger: { name: "Burger" },
  hotdog: { name: "Hotdog" },
  pizza: { name: "Pizza" },
  europe: {
    name: "Europe",
    children: ["pasta", "paella", "schnitzel", "risotto", "weisswurst"],
  },
  pasta: { name: "Pasta" },
  paella: { name: "Paella" },
  schnitzel: { name: "Schnitzel" },
  risotto: { name: "Risotto" },
  weisswurst: { name: "Weisswurst" },
  asia: { name: "Asia", children: ["sushi", "ramen", "curry", "noodles"] },
  sushi: { name: "Sushi" },
  ramen: { name: "Ramen" },
  curry: { name: "Curry" },
  noodles: { name: "Noodles" },
  australia: {
    name: "Australia",
    children: ["potatowedges", "pokebowl", "lemoncurd", "kumarafries"],
  },
  potatowedges: { name: "Potato Wedges" },
  pokebowl: { name: "Poke Bowl" },
  lemoncurd: { name: "Lemon Curd" },
  kumarafries: { name: "Kumara Fries" },
  dessert: {
    name: "Dessert",
    children: ["icecream", "cake", "pudding", "cookies"],
  },
  icecream: { name: "Icecream" },
  cake: { name: "Cake" },
  pudding: { name: "Pudding" },
  cookies: { name: "Cookies" },
  drinks: { name: "Drinks", children: ["water", "juice", "beer", "wine"] },
  water: { name: "Water" },
  juice: { name: "Juice" },
  beer: { name: "Beer" },
  wine: { name: "Wine" },
};
/** ----- SAMPLE DATA ----- */

/** ----- DATA LOADER ----- */
const dataLoader = {
    getItem: (id: string): TreeNode => data[id],
    getChildren: (id: string): string[] => data[id]?.children ?? [],
};


export default function HiearchyTree() {
    const tree = useTree<TreeNode, string>({
        rootItemId: "root",
        getItemName: (item: any) =>
            item.getItemData()?.name ?? "",
        isItemFolder: (item: any) =>
            !!item.getItemData()?.children?.length,
        dataLoader,
        indent: 20,
        features: [syncDataLoaderFeature, checkboxesFeature],
    });

    // helper: direct child count (total = direct children)
    const totalDirectChildren = (item: any) =>
        item.getChildren().length;

    // helper: recursively count leaf nodes (total leaves and selected leaves)
    const getLeafCounts = (item: any): { selectedLeaves: number; totalLeaves: number } => {
        const children = item.getChildren();
        // if no children, this is a leaf
        if (!children.length) {
            // leaf: check it using the checkbox props or tree.getState()
            const checkedIds = tree.getState()?.checkedItems ?? [];
            const isChecked = checkedIds.includes(item.getId());
            return { selectedLeaves: isChecked ? 1 : 0, totalLeaves: 1 };
        }

        // folder: sum over children
        return children.reduce(
            (acc, ch) => {
                const sub = getLeafCounts(ch);
                acc.selectedLeaves += sub.selectedLeaves;
                acc.totalLeaves += sub.totalLeaves;
                return acc;
            },
            { selectedLeaves: 0, totalLeaves: 0 }
        );
    };

    // helper: consider a direct child "selected" only if it is fully selected:
    // - If child is leaf => it must be checked
    // - If child is folder => all its descendant leaves must be checked
    const isDirectChildFullySelected = (child: any) => {
        const { selectedLeaves, totalLeaves } = getLeafCounts(child);
        // fully selected means selectedLeaves === totalLeaves && totalLeaves>0
        return totalLeaves > 0 && selectedLeaves === totalLeaves;
    };

    // helper: count how many direct children are "fully selected"
    const getDirectSelectedCount = (item: any) => {
        const children = item.getChildren();
        if (!children.length) return 0;
        return children.reduce(
            (cnt, ch) => cnt + (isDirectChildFullySelected(ch) ? 1 : 0),
            0
        );
    };

    // OPTIONAL: count selected leaves under direct child for display like "Red (2/3)"
    const getChildLeafCountsForDisplay = (child: any) =>
        getLeafCounts(child); // returns {selectedLeaves, totalLeaves}

    // handleCheck: usually not required — checkboxProps.onChange does it.
    // If you want to intercept and log or transform before letting library handle it:
    const handleCheckIntercept = (
        item: any,
        checkboxProps: any,
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        // example: log before calling original onChange
        console.log("Before onChange: id", item.getId(), "checked?", e.target.checked);
        // call library-provided onChange if exist
        checkboxProps.onChange?.(e);
        // after-change logs (state will update soon)
        setTimeout(() => {
            console.log("After change checkedIds:", tree.getState()?.checkedItems);
        }, 0);
    };

    // Render
    return (
        <div {...tree.getContainerProps()} className="tree-container">
            {tree.getItems().map((item) => {
                const { level } = item.getItemMeta();
                const checkboxProps = item.getCheckboxProps?.() ?? {};
                const isFolder = item.isFolder();

                // direct totals / selected (group-level)
                const totalDirect = totalDirectChildren(item); // direct children count
                const directSelected = isFolder ? getDirectSelectedCount(item) : 0;

                // leaf counts for display on folder children (like Red (2/3))
                const leafCounts = isFolder ? getLeafCounts(item) : { selectedLeaves: 0, totalLeaves: 0 };

                return (
                    <div
                        key={item.getId()}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            paddingLeft: `${level * 20}px`,
                        }}
                    >

                        {/* Expand / Collapse Icon */}
              {item.isFolder() && (
                <Icon
                  name={item.isExpanded() ? "caret down" : "caret right"}
                  link
                  onClick={item.toggleExpanded}
                  style={{ marginRight: 5 }}
                />
              )}
                        {/* checkbox (wire up indeterminate via ref) */}
                        <input
                            type="checkbox"
                            {...checkboxProps}
                            onChange={(e) => handleCheckIntercept(item, checkboxProps, e)}
                            ref={(el) => {
                                if (!el) return;
                                // library sets the indeterminate flag in checkboxProps.indeterminate
                                // if (typeof checkboxProps.indeterminate !== "undefined") {
                                //     el.indeterminate = checkboxProps.indeterminate;
                                // }
                            }}
                        />

                        {/* item label (button to focus/expand) */}
                        <button {...item.getProps()} style={{ background: "none", border: "none" }}>
                            {item.getItemName()}
                        </button>

                        {/* group counts */}
                        {isFolder ? (
                            <span style={{ color: "#555", marginLeft: 6 }}>
                                ({directSelected}/{totalDirect})
                            </span>
                        ) : null}

                        {/* for folders that have leaf totals (like Red showing 2/3) */}
                        {/* {isFolder && leafCounts.totalLeaves > 0 && (
                            <span style={{ color: "#888", marginLeft: 8 }}>
                                {item.getItemName()}
                                {" "}(leaves: {leafCounts.selectedLeaves}/{leafCounts.totalLeaves})
                            </span>
                        )} */}
                    </div>
                );
            })}
        </div>
    );
}
