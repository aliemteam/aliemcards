# ALiEM Cards Markdown Formatting

ALiEM Cards are formatted in [Markdown](http://commonmark.org/help/). [Markdown] is an easy way to format text so it can easily be shared across any device. With that flexibility come some formating limitations. This guide specifies the formatting standards for the cards.

If you are not familiar with [Markdown](http://commonmark.org/help/), please take just a few minutes to go through the [Markdown](http://commonmark.org/help/tutorial/) I think you will find it to be a simple and intuitive way to work.

# Front Matter
All cards must contain a front matter block. This is detailed in the Technical Guide.

# Card Titles
All cards **must** begin with a `Header 1` containing their title.

```
# ABG Interpretation
```

# References
All cards **must** close with a section for references. This section begins with a `Header 2` titled `References`:

```
## References
```

The header is followed by an unordered list of references. These references should include a link to the document's PubMed or DOI page as detailed in the Style Guide.

```
## References

-   [Rutherford RB, Baker JD, Ernst C, Johnston KW, Porter JM, Ahn S, Jones DN. Recommended standards for reports dealing with lower extremity ischemia: revised version.J Vasc Surg. 1997 Sep;26(3):517-38.](https://www.ncbi.nlm.nih.gov/pubmed/?term=9308598)
```


# Section Headers
Sections within the card should begin with a `Header 2`.

```
## Rules of thumb
```

Subsections can be set off from additional content with `Header 3` titles. Subdivision beyond this level should be avoided.

```
### Lowest Level of Header
```

# Basic Text Formatting
Basic formatting such as **bold** and *italic* text follows standard Markdown formatting as explained in the [CommonMark](http://commonmark.org/help/tutorial/).

Common formatting used in the cards include:

- bold text
- italic text
- unordered lists
- ordered lists

# Tables
Tables are formatted using [Github-flavored Markdown](https://help.github.com/articles/organizing-information-with-tables/). Tables that cannot be easily and clearly formatted using this method should be avoided.

