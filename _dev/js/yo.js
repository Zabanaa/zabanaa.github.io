// check the onScroll event of the window

let showElements = () => {

    let scrollTop = window.scrollY // save the scroll top value
    let windowHeight = window.innerHeight // save the windows height
    let sections = Array.from(document.querySelectorAll('.animated-section')) // save the sections top offset value

    sections.forEach((section) => {

        let sectionOffsetTop = section.offsetTop

        if (scrollTop > sectionOffsetTop - (windowHeight / 1.3)) {

            section.childNodes.forEach((childNode) => {

                childNode.classList.add('animate')

            })

            console.log(section.childNodes)


        }
        // if the scroll top is higher than the section top offset, that means the element is in the view port
    })

    // What we want to calculate is the when the window scroll top is higher than the offset top of the section - (20 of the windows height)
        // then we add the animate class to the children
}

window.addEventListener('scroll', showElements);
