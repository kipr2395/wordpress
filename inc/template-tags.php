<?php
/**
 * Custom template tags for this theme
 *
 * Eventually, some of the functionality here could be replaced by core features.
 *
 * @package kimsDope
 */

if ( ! function_exists( 'kimsdope_posted_on' ) ) :
/**
 * Prints HTML with meta information for the current post-date/time and author.
 */
function kimsdope_posted_on() {
	$time_string = '<time class="entry-date published updated" datetime="%1$s">%2$s</time>';
	if ( get_the_time( 'U' ) !== get_the_modified_time( 'U' ) ) {
		$time_string = '<time class="entry-date published" datetime="%1$s">%2$s</time><time class="updated" datetime="%3$s">%4$s</time>';
	}

	$time_string = sprintf( $time_string,
		esc_attr( get_the_date( 'c' ) ),
		esc_html( get_the_date() ),
		esc_attr( get_the_modified_date( 'c' ) ),
		esc_html( get_the_modified_date() )
	);

	$posted_on = sprintf(
		esc_html_x( 'Published %s', 'post date', 'kimsdope' ),
		'<a href="' . esc_url( get_permalink() ) . '" rel="bookmark">' . $time_string . '</a>'
	);

	$byline = sprintf(
		esc_html_x( 'Written by %s', 'post author', 'kimsdope' ),
		'<span class="author vcard"><a class="url fn n" href="' . esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) ) . '">' . esc_html( get_the_author() ) . '</a></span>'
	);

	echo '<span class="byline"> ' . $byline . '</span> <span class="posted-on">' . $posted_on . '</span> '; // WPCS: XSS OK.

	if ( ! post_password_required() && ( comments_open() || get_comments_number() ) ) {
		echo ' <span class="comments-link"><span class="extra">Discussion </span>';
		/* translators: %s: post title */
		comments_popup_link( sprintf( wp_kses( __( 'Leave a Comment<span class="screen-reader-text"> on %s</span>', 'kimsdope' ), array( 'span' => array( 'class' => array() ) ) ), get_the_title() ) );
		echo '</span>';
	}

		edit_post_link(
		sprintf(
			/* translators: %s: Name of current post */
			esc_html__( 'Edit %s', 'kimsdope' ),
			the_title( '<span class="screen-reader-text">"', '"</span>', false )
		),
		' <span class="edit-link"><span class="extra">Admin </span>',
		'</span>'
	);
}
endif;

if ( ! function_exists( 'kimsdope_entry_footer' ) ) :
/**
 * Prints HTML with meta information for the categories, tags and comments.
 */
function kimsdope_entry_footer() {
	// Hide tag text for pages.
	if ( 'post' === get_post_type() ) {
		// /* translators: used between list items, there is a space after the comma */
		// $categories_list = get_the_category_list( esc_html__( ', ', 'kimsdope' ) );
		// if ( $categories_list && kimsdope_categorized_blog() ) {
		// 	printf( '<span class="cat-links">' . esc_html__( 'Posted in %1$s', 'kimsdope' ) . '</span>', $categories_list ); // WPCS: XSS OK.
		// }

		/* translators: used between list items, there is a space after the comma */
		$tags_list = get_the_tag_list( '', esc_html__( ', ', 'kimsdope' ) );
		if ( $tags_list ) {
			printf( '<span class="tags-links">' . esc_html__( 'Tagged %1$s', 'kimsdope' ) . '</span>', $tags_list ); // WPCS: XSS OK.
		}
	}
}
endif;

// Display category list

function kimsdope_the_category_list(){
			$categories_list = get_the_category_list( esc_html__( ', ', 'kimsdope' ) );
		if ( $categories_list && kimsdope_categorized_blog() ) {
			printf( '<span class="cat-links">' . esc_html__( '%1$s', 'kimsdope' ) . '</span>', $categories_list ); // WPCS: XSS OK.
		}
}

/**
 * Returns true if a blog has more than 1 category.
 *
 * @return bool
 */
function kimsdope_categorized_blog() {
	if ( false === ( $all_the_cool_cats = get_transient( 'kimsdope_categories' ) ) ) {
		// Create an array of all the categories that are attached to posts.
		$all_the_cool_cats = get_categories( array(
			'fields'     => 'ids',
			'hide_empty' => 1,
			// We only need to know if there is more than one category.
			'number'     => 2,
		) );

		// Count the number of categories that are attached to the posts.
		$all_the_cool_cats = count( $all_the_cool_cats );

		set_transient( 'kimsdope_categories', $all_the_cool_cats );
	}

	if ( $all_the_cool_cats > 1 ) {
		// This blog has more than 1 category so kimsdope_categorized_blog should return true.
		return true;
	} else {
		// This blog has only 1 category so kimsdope_categorized_blog should return false.
		return false;
	}
}

/**
 * Flush out the transients used in kimsdope_categorized_blog.
 */
function kimsdope_category_transient_flusher() {
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	// Like, beat it. Dig?
	delete_transient( 'kimsdope_categories' );
}
add_action( 'edit_category', 'kimsdope_category_transient_flusher' );
add_action( 'save_post',     'kimsdope_category_transient_flusher' );

/**
 * Post navigation (previous / next post) for single posts.
 */
function kimsdope_post_navigation() {
	the_post_navigation( array(
		'next_text' => '<span class="meta-nav" aria-hidden="true">' . __( 'Next', 'kimsdope' ) . '</span> ' .
			'<span class="screen-reader-text">' . __( 'Next post:', 'kimsdope' ) . '</span> ' .
			'<span class="post-title">%title</span>',
		'prev_text' => '<span class="meta-nav" aria-hidden="true">' . __( 'Previous', 'kimsdope' ) . '</span> ' .
			'<span class="screen-reader-text">' . __( 'Previous post:', 'kimsdope' ) . '</span> ' .
			'<span class="post-title">%title</span>',
	) );
}
///////
//Customize ellipse @ end of excerpts
///////
// function kimsdope_excerpt_more( $more ) {
// 	return "…";
// }
// add_filter('excerpt_more', 'kimsdope_excerpt_more');











